
import React, { useEffect, useRef, useState } from "react";

const h = React.createElement;

export default function VoiceCare({ medicines: propMedicines, onConfirmMedicine }) {
  const [language, setLanguage] = useState("en-IN");
  const [medicines, setMedicines] = useState(() => {
    if (Array.isArray(propMedicines)) return propMedicines;
    try {
      return JSON.parse(localStorage.getItem("carecircle_data"))?.medicines || [];
    } catch {
      return [];
    }
  });

  const [messages, setMessages] = useState([]);
  const [active, setActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [error, setError] = useState("");

  const queue = useRef([]);
  const currentIndex = useRef(0);
  const activeRef = useRef(false);
  const recognitionRef = useRef(null);
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    if (Array.isArray(propMedicines)) setMedicines(propMedicines);
  }, [propMedicines]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort?.();
    };
  }, []);

  const isHindi = () => languageRef.current === "hi-IN";

  const addMessage = (sender, text, status = "") => {
    setMessages(prev => [
      ...prev,
      { id: Date.now() + Math.random(), sender, text, status }
    ]);
  };

  const speak = (text, callback) => {
    if (!window.speechSynthesis) {
      setError("Speech output is not supported. Please use the text response box.");
      callback?.();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageRef.current;
    utterance.rate = 0.88;
    utterance.pitch = 1;

    utterance.onend = () => callback?.();
    utterance.onerror = () => callback?.();

    window.speechSynthesis.speak(utterance);
  };

  const getQuestion = medicine => {
    if (isHindi()) {
      return `क्या आपने ${medicine.name}, ${medicine.dose || ""} ले ली है? कृपया हाँ या नहीं में बताइए।`;
    }

    return `Have you taken your ${medicine.name}, ${medicine.dose || ""}? Please say yes or no.`;
  };

  const listen = () => {
    if (!activeRef.current) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition is unavailable in this browser. Try Chrome or Edge, or type your answer below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();

      recognition.lang = languageRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);

      recognition.onend = () => setListening(false);

      recognition.onerror = event => {
        setListening(false);

        if (activeRef.current && event.error !== "aborted") {
          repeatQuestion();
        }
      };

      recognition.onresult = event => {
        const answer = event.results?.[0]?.[0]?.transcript?.trim();

        if (answer) {
          processAnswer(answer);
        } else {
          repeatQuestion();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setListening(false);
      setError("Could not start microphone. Check your browser microphone permission.");
    }
  };

  const repeatQuestion = () => {
    if (!activeRef.current) return;

    const text = isHindi()
      ? "माफ़ कीजिए, मैं आपकी बात समझ नहीं पाया। कृपया फिर से बताइए कि आपने दवा ली है या नहीं।"
      : "Sorry, I couldn't understand you clearly. Could you please repeat whether you took the medicine or not?";

    addMessage("assistant", text, "Please repeat");
    speak(text, listen);
  };

  const saveMedicine = medicine => {
    if (onConfirmMedicine) {
      onConfirmMedicine(medicine.id);
    } else {
      const updated = medicines.map(item =>
        item.id === medicine.id ? { ...item, taken: true } : item
      );

      setMedicines(updated);

      try {
        const stored = JSON.parse(localStorage.getItem("carecircle_data") || "{}");
        stored.medicines = updated;
        localStorage.setItem("carecircle_data", JSON.stringify(stored));
      } catch {
        setError("Could not save the medicine status locally.");
      }
    }

    addMessage(
      "assistant",
      isHindi()
        ? `${medicine.name} को लिया हुआ दर्ज कर लिया गया है।`
        : `${medicine.name} has been marked as taken.`,
      "Confirmed"
    );
  };

  const askNext = index => {
    if (!activeRef.current) return;

    if (index >= queue.current.length) {
      const finish = isHindi()
        ? "आपकी दवाइयों की जाँच पूरी हो गई है। धन्यवाद।"
        : "Your medicine check-in is complete. Thank you.";

      addMessage("assistant", finish);
      speak(finish);

      activeRef.current = false;
      setActive(false);
      setListening(false);
      return;
    }

    currentIndex.current = index;

    const medicine = queue.current[index];
    const question = getQuestion(medicine);

    addMessage(
      "assistant",
      question,
      `${index + 1} of ${queue.current.length}`
    );

    speak(question, listen);
  };

  const processAnswer = answer => {
    if (!activeRef.current) return;

    addMessage("patient", answer);

    const text = answer.toLowerCase().trim();

    const noWords = [
      "no", "nope", "not yet", "didn't", "did not",
      "have not", "haven't", "nahi", "nahin",
      "नहीं", "नही", "अभी नहीं", "नहीं ली", "नहीं लिया"
    ];

    const yesWords = [
      "yes", "yeah", "yep", "i took", "i have taken",
      "taken", "done", "haan", "han", "हाँ", "हां",
      "जी", "ले ली", "ले लिया", "खा ली", "खा लिया"
    ];

    const isNo = noWords.some(word => text.includes(word));
    const isYes = yesWords.some(word => text.includes(word));

    const medicine = queue.current[currentIndex.current];

    if (isNo) {
      const reply = isHindi()
        ? `ठीक है। ${medicine.name} को लिया हुआ दर्ज नहीं किया जाएगा।`
        : `Okay. ${medicine.name} will not be marked as taken.`;

      addMessage("assistant", reply, "Not confirmed");
      speak(reply, () => askNext(currentIndex.current + 1));
      return;
    }

    if (isYes) {
      saveMedicine(medicine);

      const reply = isHindi()
        ? "ठीक है।"
        : "Okay.";

      speak(reply, () => askNext(currentIndex.current + 1));
      return;
    }

    repeatQuestion();
  };

  const startCheckIn = () => {
    setError("");
    setMessages([]);

    const pending = medicines.filter(item => !item.taken);

    if (!pending.length) {
      const text = isHindi()
        ? "आपकी सभी दवाइयाँ पहले से पुष्टि की गई हैं।"
        : "All your listed medicines are already confirmed.";

      addMessage("assistant", text);
      speak(text);
      return;
    }

    queue.current = pending;
    currentIndex.current = 0;
    activeRef.current = true;
    setActive(true);

    const greeting = isHindi()
      ? `नमस्ते। आज आपकी ${pending.length} दवाइयों की जाँच करेंगे।`
      : `Hello! Let's check your ${pending.length} pending medicines one by one.`;

    addMessage("assistant", greeting);
    speak(greeting, () => askNext(0));
  };

  const stopCheckIn = () => {
    activeRef.current = false;
    setActive(false);
    setListening(false);

    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel();

    addMessage(
      "assistant",
      isHindi()
        ? "जाँच रोक दी गई है। अपुष्ट दवाइयाँ पुष्टि नहीं की जाएँगी।"
        : "Check-in stopped. Unconfirmed medicines will remain unconfirmed."
    );
  };

  const submitAnswer = event => {
    event.preventDefault();

    if (!typedAnswer.trim() || !active) return;

    processAnswer(typedAnswer.trim());
    setTypedAnswer("");
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#176c60",
    color: "white",
    fontWeight: "700",
    cursor: "pointer"
  };

  const cardStyle = {
    background: "var(--vc-card, white)",
    border: "1px solid #e5eeea",
    borderRadius: "16px",
    padding: "20px",
    minWidth: 0
  };

  return h(
    "section",
    { className: "cc-section" },

    h("style", null, `
      .vc-layout{display:grid;grid-template-columns:1.3fr .7fr;gap:18px}
      .vc-chat{height:340px;overflow-y:auto;background:#f5f9f7;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
      .vc-message{padding:12px 14px;border-radius:13px;max-width:85%;font-size:14px;line-height:1.5;white-space:pre-wrap}
      .vc-assistant{align-self:flex-start;background:white;border:1px solid #e5eeea;color:#294840}
      .vc-patient{align-self:flex-end;background:#176c60;color:white}
      .vc-mic{width:82px;height:82px;border-radius:50%;border:7px solid #e0f2eb;background:#176c60;color:white;font-size:27px;cursor:pointer;display:block;margin:20px auto 10px}
      .vc-listening{background:#b44335;border-color:#ffe6e1}
      .vc-medicine{display:flex;justify-content:space-between;gap:10px;padding:13px 0;border-bottom:1px solid #edf1ef;font-size:13px}
      .vc-medicine:last-child{border:0}
      .vc-input{display:flex;gap:8px;margin-top:14px}
      .vc-input input{flex:1;min-width:0;padding:11px;border:1px solid #dce6e1;border-radius:9px}
      @media(max-width:800px){.vc-layout{grid-template-columns:1fr}}
    `),

    h("div", { className: "cc-welcome" },
      h("div", null,
        h("h1", null, "VoiceCare"),
        h("div", { className: "cc-muted" }, "Your personal medicine voice companion.")
      )
    ),

    h("div", { className: "vc-layout" },

      h("div", { style: cardStyle },

        h("div", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "18px"
          }
        },
          h("strong", null, "Talk with CareCircle"),

          h("select", {
            value: language,
            disabled: active,
            onChange: e => setLanguage(e.target.value),
            style: {
              padding: "10px",
              border: "1px solid #dce6e1",
              borderRadius: "9px"
            }
          },
            h("option", { value: "en-IN" }, "English"),
            h("option", { value: "hi-IN" }, "हिन्दी")
          )
        ),

        h("div", { className: "vc-chat", "aria-live": "polite" },
          messages.length === 0
            ? h("p", { style: { color: "#82918c", textAlign: "center", margin: "auto" } },
                "Press Start Check-in to begin your voice conversation."
              )
            : messages.map(message =>
                h("div", {
                  key: message.id,
                  className: `vc-message ${message.sender === "patient" ? "vc-patient" : "vc-assistant"}`
                },
                  message.text,
                  message.status
                    ? h("div", { style: { fontSize: "10px", opacity: .7, marginTop: "5px" } }, message.status)
                    : null
                )
              )
        ),

        h("button", {
          type: "button",
          className: `vc-mic ${listening ? "vc-listening" : ""}`,
          onClick: active ? stopCheckIn : startCheckIn,
          title: active ? "Stop check-in" : "Start check-in"
        }, active ? "■" : "🎙"),

        h("p", {
          style: {
            textAlign: "center",
            color: "#82918c",
            fontSize: "12px"
          }
        }, listening ? "Listening... Speak now." : active ? "Voice check-in active" : "Tap the microphone to start"),

        h("form", { className: "vc-input", onSubmit: submitAnswer },
          h("input", {
            value: typedAnswer,
            onChange: e => setTypedAnswer(e.target.value),
            placeholder: "Or type your answer: yes / no",
            "aria-label": "Medicine response"
          }),
          h("button", {
            type: "submit",
            disabled: !active,
            style: { ...buttonStyle, opacity: active ? 1 : .5 }
          }, "Send")
        ),

        error ? h("p", {
          style: {
            background: "#fff5e6",
            padding: "12px",
            borderRadius: "9px",
            color: "#805d25",
            fontSize: "12px"
          }
        }, error) : null,

        active ? h("button", {
          type: "button",
          onClick: stopCheckIn,
          style: {
            ...buttonStyle,
            background: "#f1f5f3",
            color: "#31584d",
            marginTop: "12px"
          }
        }, "Stop check-in") : null
      ),

      h("aside", { style: cardStyle },
        h("h2", { style: { fontSize: "17px", marginTop: 0 } }, "Medicine schedule"),
        h("p", {
          style: { color: "#82918c", fontSize: "12px", lineHeight: 1.6 }
        }, "Each medicine is checked separately. Only a clear yes confirms a dose."),

        medicines.length
          ? medicines.map(medicine =>
              h("div", { className: "vc-medicine", key: medicine.id },
                h("div", null,
                  h("strong", null, medicine.name),
                  h("div", { style: { color: "#82918c", fontSize: "11px", marginTop: "4px" } },
                    `${medicine.dose || ""} · ${medicine.time || ""}`
                  )
                ),
                h("span", {
                  style: {
                    color: medicine.taken ? "#176c60" : "#9a6b15",
                    fontWeight: "700",
                    fontSize: "11px",
                    whiteSpace: "nowrap"
                  }
                }, medicine.taken ? "Confirmed" : "Pending")
              )
            )
          : h("p", { style: { color: "#82918c", textAlign: "center", padding: "20px" } },
              "No medicines added yet."
            ),

        h("div", {
          style: {
            background: "#fff5e6",
            color: "#805d25",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "12px",
            lineHeight: 1.6,
            marginTop: "18px"
          }
        }, "Prototype: Uses browser speech recognition and speech synthesis with basic Hindi/English response matching. It does not provide medical advice or send real external notifications.")
      )
    )
  );
}
