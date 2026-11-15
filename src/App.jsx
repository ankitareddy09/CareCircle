
import React, { useEffect, useState } from "react";

const initialData = {
  medicines: [
    { id: 1, name: "Vitamin D", dose: "1 tablet", time: "08:00 AM", taken: false },
    { id: 2, name: "Blood Pressure Medicine", dose: "1 tablet", time: "09:00 AM", taken: true },
    { id: 3, name: "Calcium", dose: "1 tablet", time: "08:00 PM", taken: false }
  ],
  appointments: [
    { id: 1, doctor: "Dr. Ananya Rao", type: "General Checkup", date: "18 Nov 2026", time: "10:30 AM" },
    { id: 2, doctor: "Dr. Vikram", type: "Follow-up", date: "24 Nov 2026", time: "04:00 PM" }
  ],
  records: [
    { id: 1, name: "Blood Test Report", date: "10 Nov 2026", type: "Laboratory Report" },
    { id: 2, name: "Prescription", date: "05 Nov 2026", type: "Prescription" }
  ],
  checkin: "Good",
  notes: "Feeling comfortable today."
};

const caregivers = [
  { id: 1, name: "Priya Sharma", role: "Elderly Caregiver", experience: "4 years experience", rating: "4.9", initials: "PS" },
  { id: 2, name: "Rahul Kumar", role: "Home Care Assistant", experience: "3 years experience", rating: "4.8", initials: "RK" },
  { id: 3, name: "Meera Joshi", role: "Personal Care Assistant", experience: "5 years experience", rating: "4.9", initials: "MJ" }
];

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box}
body{margin:0;background:#FFFFFF;font-family:'DM Sans',sans-serif;color:#172554}
button,input,select,textarea{font:inherit}
button{cursor:pointer}
.cc{width:100%;min-height:100vh;background:#FFFFFF}
.cc button{transition:.2s}
.cc button:focus-visible,.cc input:focus-visible,.cc textarea:focus-visible{outline:3px solid #BFDBFE;outline-offset:2px}
.cc-header{height:76px;background:#fff;border-bottom:1px solid #BFDBFE;display:flex;align-items:center;justify-content:space-between;padding:0 5%;position:sticky;top:0;z-index:10}
.cc-logo{display:flex;align-items:center;gap:10px;font-family:Manrope,sans-serif;font-size:22px;font-weight:800;color:#172554}
.cc-logo-mark{width:38px;height:38px;background:#BFDBFE;border-radius:13px;display:grid;place-items:center;font-size:22px}
.cc-header-right{display:flex;align-items:center;gap:14px}
.cc-user{width:38px;height:38px;border-radius:50%;background:#BFDBFE;color:#172554;display:grid;place-items:center;font-weight:800}
.cc-btn{border:0;border-radius:11px;padding:12px 18px;font-weight:700;background:#172554;color:#FFFFFF}
.cc-btn:hover{background:#172554;transform:translateY(-1px)}
.cc-btn-light{background:#BFDBFE;color:#172554}
.cc-btn-light:hover{background:#BFDBFE}
.cc-btn-danger{background:#BFDBFE;color:#172554}
.cc-btn-danger:hover{background:#BFDBFE}
.cc-landing{
  width:100%;
  max-width:none;
  margin:0;
  padding:75px 5%;
  background:
    linear-gradient(rgba(255,255,255,.83),rgba(255,255,255,.88)),
    url("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=2000&q=85");
  background-size:cover;
  background-position:center;
  background-attachment:fixed;
}

.cc-hero{
  display:grid;
  grid-template-columns:1fr;
  gap:35px;
  align-items:center;
  max-width:1100px;
  margin:auto;
  padding:55px 0;
}

.cc-hero h1{
  font-family:Manrope,sans-serif;
  font-size:clamp(38px,5vw,62px);
  line-height:1.12;
  letter-spacing:-2px;
  margin:18px 0;
  color:#172554;
  max-width:850px;
}

.cc-hero h1 span{color:#172554}

.cc-hero p{
  font-size:17px;
  line-height:1.8;
  color:#172554;
  max-width:680px;
}

.cc-hero-art{display:none}

.cc-hero-actions{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  margin-top:28px;
}

.cc-features{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:18px;
  margin:35px auto 0;
  max-width:1100px;
}

.cc-feature{
  background:rgba(255,255,255,.91);
  padding:25px;
  border:1px solid #BFDBFE;
  border-radius:18px;
  backdrop-filter:blur(5px);
}

.cc-feature-icon{font-size:27px}
.cc-feature h3{margin:14px 0 7px;font-family:Manrope}
.cc-feature p{font-size:14px;line-height:1.7;color:#172554;margin:0}

.cc-footer{
  text-align:center;
  padding:30px;
  color:#172554;
  font-size:13px;
  background:#FFFFFF;
}.cc-layout{display:grid;grid-template-columns:235px minmax(0,1fr);width:100%;max-width:none;margin:0;min-height:calc(100vh - 76px)}
.cc-sidebar{background:white;border-right:1px solid #BFDBFE;padding:25px 16px}
.cc-side-label{font-size:11px;font-weight:800;color:#172554;letter-spacing:1.3px;padding:10px 13px}
.cc-nav{display:flex;align-items:center;gap:12px;width:100%;border:0;background:transparent;padding:13px;border-radius:11px;text-align:left;color:#172554;font-weight:600;margin:3px 0}
.cc-nav:hover,.cc-nav.active{background:#BFDBFE;color:#172554}
.cc-nav-icon{font-size:19px;width:22px;text-align:center}
.cc-main{padding:32px;min-width:0}
.cc-welcome{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:25px}
.cc-welcome h1{font-family:Manrope;font-size:27px;margin:0 0 5px;color:#172554}
.cc-muted{color:#172554;font-size:14px}
.cc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:22px}
.cc-stat{background:white;border:1px solid #BFDBFE;padding:19px;border-radius:16px}
.cc-stat-icon{font-size:23px}
.cc-stat strong{display:block;font-family:Manrope;font-size:27px;margin:10px 0 3px;color:#172554}
.cc-stat span{font-size:13px;color:#172554}
.cc-columns{display:grid;grid-template-columns:1.25fr .75fr;gap:18px;margin-bottom:18px}
.cc-card{background:white;border:1px solid #BFDBFE;border-radius:17px;padding:21px;margin-bottom:18px;min-width:0}
.cc-card h2{font-family:Manrope;font-size:17px;margin:0 0 5px;color:#172554}
.cc-card-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:17px}
.cc-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;border-bottom:1px solid #BFDBFE}
.cc-row:last-child{border-bottom:0}
.cc-row-title{font-weight:700;font-size:14px}
.cc-row-sub{font-size:12px;color:#172554;margin-top:5px}
.cc-pill{font-size:11px;font-weight:800;padding:6px 10px;border-radius:20px;background:#BFDBFE;color:#172554;white-space:nowrap}
.cc-pill.pending{background:#BFDBFE;color:#172554}
.cc-pill.red{background:#BFDBFE;color:#172554}
.cc-check{width:22px;height:22px;accent-color:#172554}
.cc-progress{height:8px;background:#BFDBFE;border-radius:20px;overflow:hidden;margin:12px 0}
.cc-progress div{height:100%;background:#172554;border-radius:20px}
.cc-big-checkin{background:#BFDBFE;border-radius:14px;padding:18px}
.cc-big-checkin p{color:#172554;font-size:13px}
.cc-checkin-options{display:flex;gap:8px;flex-wrap:wrap}
.cc-checkin-options button{border:1px solid #BFDBFE;background:white;color:#172554;padding:9px 12px;border-radius:10px;font-size:12px;font-weight:700}
.cc-checkin-options button.selected{background:#172554;color:white;border-color:#172554}
.cc-alert{background:#BFDBFE;border:1px solid #BFDBFE;border-radius:14px;padding:15px;color:#172554;font-size:13px;line-height:1.6}
.cc-emergency{background:#BFDBFE;border:1px solid #BFDBFE;border-radius:15px;padding:18px}
.cc-emergency h3{color:#172554;margin:0 0 6px;font-size:16px}
.cc-emergency p{font-size:13px;color:#172554;line-height:1.6}
.cc-section{width:100%;max-width:none}
.cc-field{display:flex;flex-direction:column;gap:7px;margin-bottom:15px}
.cc-field label{font-size:13px;font-weight:700;color:#172554}
.cc-field input,.cc-field textarea,.cc-field select{width:100%;padding:12px;border:1px solid #BFDBFE;border-radius:10px;background:white;color:#172554}
.cc-field input:focus,.cc-field textarea:focus,.cc-field select:focus{outline:2px solid #BFDBFE;outline-offset:1px}
.cc-field textarea{min-height:85px;resize:vertical}
.cc-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.cc-record{display:flex;align-items:center;gap:13px;padding:15px;border:1px solid #BFDBFE;border-radius:12px;margin-bottom:10px}
.cc-record-icon{width:42px;height:42px;border-radius:12px;background:#BFDBFE;display:grid;place-items:center;font-size:20px}
.cc-caregiver{display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid #BFDBFE}
.cc-avatar{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#BFDBFE;color:#172554;font-weight:800;flex-shrink:0}
.cc-empty{text-align:center;padding:35px;color:#172554}
.cc-toast{position:fixed;bottom:25px;right:25px;background:#172554;color:white;padding:14px 20px;border-radius:12px;box-shadow:0 10px 30px #0002;z-index:30;font-size:14px}
.cc-login-wrap{min-height:calc(100vh - 76px);display:grid;place-items:center;padding:30px}
.cc-login{background:white;border:1px solid #BFDBFE;border-radius:22px;padding:32px;width:min(100%,480px);box-shadow:0 15px 50px #1725540d}
.cc-login h1{font-family:Manrope;margin:0 0 8px}
.cc-role-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:18px 0}
.cc-role{border:1px solid #BFDBFE;background:white;border-radius:12px;padding:15px 5px;color:#172554;font-weight:700}
.cc-role.selected{border:2px solid #172554;background:#BFDBFE;color:#172554}
.cc-mobile-menu{display:none}

@media(max-width:950px){
  .cc-grid{grid-template-columns:repeat(2,1fr)}
  .cc-columns{grid-template-columns:1fr}
  .cc-main{padding:22px}
  .cc-hero{grid-template-columns:1fr}
  .cc-hero-art{min-height:300px}
}

@media(max-width:650px){
  .cc-header{padding:0 16px}
  .cc-landing{
  background-attachment:scroll;
  padding:45px 18px;}
  .cc-layout{grid-template-columns:1fr}
  .cc-sidebar{display:flex;overflow-x:auto;border-right:0;border-bottom:1px solid #BFDBFE;padding:8px}
  .cc-side-label{display:none}
  .cc-nav{white-space:nowrap;width:auto;padding:10px}
  .cc-main{padding:18px 13px}
  .cc-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
  .cc-stat{padding:14px}
  .cc-stat strong{font-size:22px}
  .cc-welcome{align-items:flex-start;flex-direction:column}
  .cc-features{grid-template-columns:1fr}
  .cc-landing{padding:45px 18px}
  .cc-hero h1{letter-spacing:-1px}
  .cc-form-grid{grid-template-columns:1fr}
  .cc-role-grid{grid-template-columns:1fr}
  .cc-header-right .cc-user{display:none}
}

/* DARK MODE */
.cc.dark{background:#172554;color:#FFFFFF}
.cc.dark .cc-header,
.cc.dark .cc-sidebar,
.cc.dark .cc-card,
.cc.dark .cc-stat,
.cc.dark .cc-feature,
.cc.dark .cc-login,
.cc.dark .cc-art-card{background:#172554;border-color:#BFDBFE;color:#FFFFFF}
.cc.dark .cc-hero h1,
.cc.dark .cc-welcome h1,
.cc.dark .cc-card h2,
.cc.dark .cc-art-card h3,
.cc.dark .cc-feature h3{color:#FFFFFF}
.cc.dark .cc-hero p,
.cc.dark .cc-feature p,
.cc.dark .cc-muted,
.cc.dark .cc-row-sub,
.cc.dark .cc-stat span{color:#BFDBFE}
.cc.dark .cc-hero-art,
.cc.dark .cc-big-checkin,
.cc.dark .cc-art-row{background:#172554}
.cc.dark .cc-nav{color:#BFDBFE}
.cc.dark .cc-nav:hover,
.cc.dark .cc-nav.active{background:#BFDBFE;color:#172554}
.cc.dark .cc-row,
.cc.dark .cc-caregiver,
.cc.dark .cc-record{border-color:#BFDBFE}
.cc.dark .cc-field label{color:#BFDBFE}
.cc.dark .cc-field input,
.cc.dark .cc-field textarea,
.cc.dark .cc-field select{background:#172554;border-color:#BFDBFE;color:#FFFFFF}
.cc.dark .cc-checkin-options button,
.cc.dark .cc-role{background:#172554;border-color:#BFDBFE;color:#FFFFFF}
.cc.dark .cc-checkin-options button.selected,
.cc.dark .cc-role.selected{background:#BFDBFE;color:#172554}
.cc.dark .cc-record-icon,
.cc.dark .cc-avatar{background:#BFDBFE;color:#172554}
.cc.dark .cc-emergency{background:#172554;border-color:#BFDBFE}
.cc.dark .cc-alert{background:#172554;border-color:#BFDBFE;color:#BFDBFE}
.cc.dark .cc-btn-light{background:#BFDBFE;color:#172554}
.cc.dark .cc-logo{color:#FFFFFF}
.cc.dark .cc-logo-mark{background:#BFDBFE;color:#172554}
.cc.dark .cc-big-checkin p{color:#BFDBFE}
.cc.dark .cc-pill{background:#BFDBFE;color:#172554}
.cc.dark .cc-footer{color:#BFDBFE}
/* ===== CARECIRCLE LANDING PAGE ===== */

html{scroll-behavior:smooth}
body{background:#f4f9ff;color:#17365d}
.cc{background:#f4f9ff;color:#17365d}
.cc-landing{padding:0 0 55px;overflow:hidden;background:#f4f9ff}

/* Seamless full-width hero — NOT a two-column layout */
.cc-hero{
  position:relative;
  isolation:isolate;
  display:block;
  min-height:590px;
  width:100%;
  margin:0;
  padding:115px max(7%,calc((100% - 1200px)/2));
  overflow:hidden;
  background:linear-gradient(115deg,#eaf6ff,#d7edff);
}

.cc-hero::before{
  content:"";
  position:absolute;
  inset:0;
  z-index:-1;
  background:
    linear-gradient(90deg,
      #eaf6ff 0%,
      rgba(234,246,255,.98) 28%,
      rgba(226,242,255,.76) 48%,
      rgba(216,238,255,.12) 100%);
}

.cc-hero::after{
  content:"";
  position:absolute;
  z-index:-2;
  top:0;
  right:0;
  width:78%;
  height:100%;
  background-image:url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=88");
  background-position:center 38%;
  background-size:cover;
  background-repeat:no-repeat;
  -webkit-mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.18) 13%,rgba(0,0,0,.88) 39%,#000 100%);
  mask-image:linear-gradient(90deg,transparent 0%,rgba(0,0,0,.18) 13%,rgba(0,0,0,.88) 39%,#000 100%);
}

.cc-hero-copy{
  position:relative;
  z-index:2;
  width:min(560px,52%);
}

.cc-eyebrow{
  display:inline-flex;
  padding:10px 16px;
  border-radius:30px;
  background:rgba(255,255,255,.75);
  border:1px solid #cce5f8;
  color:#236fa8;
  font-size:13px;
  font-weight:800;
  letter-spacing:.2px;
}

.cc-hero h1{
  font-family:Manrope,sans-serif;
  font-size:clamp(48px,6vw,76px);
  line-height:1.04;
  letter-spacing:-2.8px;
  margin:24px 0 16px;
  color:#12365d;
}

.cc-hero p{
  max-width:470px;
  font-size:18px;
  line-height:1.75;
  color:#526f89;
  margin:0;
}

.cc-hero-actions{
  display:flex;
  align-items:center;
  gap:26px;
  margin-top:32px;
}

.cc-hero-actions .cc-btn{padding:15px 24px}

.cc-learn-link{
  color:#315574;
  text-decoration:none;
  font-size:15px;
  font-weight:700;
}

.cc-learn-link:hover{color:#1685d8}

.cc-hero-decor{
  position:absolute;
  color:rgba(42,133,202,.18);
  font-size:46px;
  z-index:0;
}

.cc-decor-one{top:45px;left:48%}
.cc-decor-two{bottom:54px;left:43%;font-size:58px}

/* Feature cards */

.cc-features{
  position:relative;
  z-index:3;
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:20px;
  width:min(1160px,90%);
  margin:-28px auto 105px;
}

.cc-feature{
  background:#fff;
  border:1px solid #e2effa;
  border-radius:20px;
  padding:28px;
  box-shadow:0 15px 38px rgba(40,100,150,.08);
  transition:transform .2s,box-shadow .2s;
}

.cc-feature:hover{
  transform:translateY(-5px);
  box-shadow:0 20px 42px rgba(40,100,150,.13);
}

.cc-feature-icon{
  width:54px;
  height:54px;
  display:grid;
  place-items:center;
  border-radius:16px;
  background:#e9f5ff;
  color:#197bd0;
  font-size:27px;
  font-weight:800;
}

.cc-feature h3{
  font-family:Manrope;
  color:#173e65;
  font-size:18px;
  margin:18px 0 8px;
}

.cc-feature p{
  font-size:14px;
  line-height:1.7;
  color:#6b8298;
  margin:0;
}

/* About section */

.cc-about{
  width:min(1160px,90%);
  margin:0 auto 100px;
  display:grid;
  grid-template-columns:.85fr 1.15fr;
  gap:80px;
  align-items:center;
}

.cc-about-art{
  min-height:350px;
  position:relative;
  display:grid;
  place-items:center;
  border-radius:38px;
  background:linear-gradient(145deg,#e8f5ff,#d4ebff);
  overflow:hidden;
}

.cc-about-art::before,
.cc-about-art::after{
  content:"";
  position:absolute;
  border:1px solid rgba(46,135,202,.16);
  border-radius:50%;
  width:270px;
  height:270px;
}

.cc-about-art::after{width:340px;height:340px}

.cc-about-orbit{
  position:absolute;
  top:48px;
  right:54px;
  font-size:42px;
  color:#83bde8;
}

.cc-about-cross{
  position:absolute;
  left:55px;
  bottom:54px;
  font-size:52px;
  color:#8fc6ee;
}

.cc-about-heart{
  width:130px;
  height:130px;
  display:grid;
  place-items:center;
  border-radius:38px;
  background:linear-gradient(145deg,#fff,#e8f5ff);
  box-shadow:0 18px 45px rgba(41,111,164,.15);
  color:#2687d2;
  font-size:62px;
  z-index:1;
}

.cc-section-kicker{
  color:#2180c5;
  font-size:13px;
  font-weight:800;
  letter-spacing:1.2px;
  text-transform:uppercase;
}

.cc-about-copy h2{
  font-family:Manrope;
  font-size:clamp(30px,4vw,43px);
  line-height:1.15;
  color:#173e65;
  margin:14px 0;
}

.cc-about-copy>p{
  font-size:16px;
  line-height:1.8;
  color:#667f96;
}

.cc-benefits{
  display:grid;
  gap:19px;
  margin-top:27px;
}

.cc-benefits>div{
  display:flex;
  align-items:flex-start;
  gap:14px;
}

.cc-benefits>div>span{
  width:38px;
  height:38px;
  flex:0 0 38px;
  border-radius:12px;
  display:grid;
  place-items:center;
  background:#e7f4ff;
  color:#197bd0;
  font-size:19px;
  font-weight:800;
}

.cc-benefits strong{
  display:block;
  color:#21496d;
  font-size:15px;
  margin:1px 0 4px;
}

.cc-benefits small{
  display:block;
  color:#7890a5;
  font-size:13px;
  line-height:1.5;
}

/* Bottom call to action */

.cc-join-banner{
  width:min(1160px,90%);
  margin:0 auto;
  padding:28px 34px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:22px;
  border:1px solid #cfe7fa;
  border-radius:24px;
  background:linear-gradient(110deg,#e8f5ff,#d8edff);
  box-shadow:0 14px 36px rgba(45,112,165,.09);
}

.cc-join-brand{
  display:flex;
  align-items:center;
  gap:12px;
  color:#155486;
  font-family:Manrope;
  font-size:20px;
}

.cc-join-banner p{
  color:#244f73;
  font-size:16px;
  font-weight:700;
  margin:0;
}

.cc-btn-navy{
  background:#173f68;
  white-space:nowrap;
}

.cc-btn-navy:hover{background:#102f50}

/* Public header buttons */

.cc-btn{
  background:#197bd0;
  color:#fff;
  border-radius:12px;
}

.cc-btn:hover{background:#1168b6}

.cc-btn-light{
  background:#e8f4ff;
  color:#1769aa;
}

/* Responsive */

@media(max-width:900px){
  .cc-hero{min-height:540px;padding:95px 6%}
  .cc-hero-copy{width:58%}
  .cc-hero::after{width:80%;background-position:58% center}
  .cc-about{gap:38px}
}

@media(max-width:650px){
  .cc-hero{
    min-height:690px;
    padding:58px 22px 310px;
  }

  .cc-hero::before{
    background:linear-gradient(180deg,
      #eaf6ff 0%,
      rgba(234,246,255,.98) 36%,
      rgba(226,242,255,.72) 58%,
      rgba(216,238,255,.06) 100%);
  }

  .cc-hero::after{
    top:auto;
    bottom:0;
    width:100%;
    height:62%;
    background-position:center 35%;
    -webkit-mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.45) 18%,#000 48%);
    mask-image:linear-gradient(180deg,transparent 0%,rgba(0,0,0,.45) 18%,#000 48%);
  }

  .cc-hero-copy{width:100%}
  .cc-hero h1{font-size:52px;margin:18px 0 12px}
  .cc-hero p{font-size:16px}
  .cc-hero-actions{gap:17px;flex-wrap:wrap;margin-top:24px}
  .cc-decor-one{top:30px;right:25px;left:auto}
  .cc-decor-two{display:none}

  .cc-features{
    grid-template-columns:1fr;
    width:calc(100% - 32px);
    margin:-18px auto 70px;
    gap:12px;
  }

  .cc-feature{padding:21px}

  .cc-about{
    width:calc(100% - 36px);
    grid-template-columns:1fr;
    gap:28px;
    margin-bottom:70px;
  }

  .cc-about-art{min-height:240px;border-radius:28px}

  .cc-join-banner{
    width:calc(100% - 32px);
    padding:24px;
    flex-direction:column;
    align-items:flex-start;
  }

  .cc-join-banner p{line-height:1.55}
  .cc-join-banner .cc-btn{width:100%}
}

/* Landing page dark mode */

.cc.dark .cc-landing{background:#101d2a}
.cc.dark .cc-hero{background:linear-gradient(115deg,#172d43,#203d56)}
.cc.dark .cc-hero::before{
  background:linear-gradient(90deg,#172d43 0%,rgba(23,45,67,.98) 28%,rgba(23,45,67,.72) 49%,rgba(23,45,67,.12) 100%);
}
.cc.dark .cc-eyebrow{background:#1c3952;color:#b8def9}
.cc.dark .cc-hero h1,.cc.dark .cc-about-copy h2{color:#e9f5ff}
.cc.dark .cc-hero p,.cc.dark .cc-about-copy>p{color:#b2c8da}
.cc.dark .cc-feature,.cc.dark .cc-about-art{background:#1a3044;border-color:#314b62}
.cc.dark .cc-feature h3,.cc.dark .cc-benefits strong{color:#e1f1ff}
.cc.dark .cc-feature p,.cc.dark .cc-benefits small{color:#a9bfd1}
.cc.dark .cc-benefits>div>span,.cc.dark .cc-feature-icon{background:#284761;color:#9bd0f6}
.cc.dark .cc-join-banner{background:linear-gradient(110deg,#1b344b,#24435e);border-color:#385773}
.cc.dark .cc-join-banner p,.cc.dark .cc-join-brand{color:#e1f1ff}

`;

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carecircle_user")) || null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("carecircle-theme") === "dark";
  });

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("carecircle-theme", next ? "dark" : "light");
      return next;
    });
  };

  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("carecircle_data")) || initialData;
    } catch {
      return initialData;
    }
  });

  const [page, setPage] = useState("Dashboard");
  const [role, setRole] = useState("Patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState("");
  const [notes, setNotes] = useState(data.notes || "");
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([]);
  const [medicineForm, setMedicineForm] = useState({ name: "", dose: "", time: "" });
  const [appointmentForm, setAppointmentForm] = useState({ doctor: "", type: "", date: "", time: "" });
  const [recordForm, setRecordForm] = useState({ name: "", date: "", type: "Medical Report" });

  useEffect(() => {
    localStorage.setItem("carecircle_data", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (user) localStorage.setItem("carecircle_user", JSON.stringify(user));
    else localStorage.removeItem("carecircle_user");
  }, [user]);

  const notify = message => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const updateData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const login = e => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      return notify("Please enter your name and email.");
    }
    setUser({ name: name.trim(), email: email.trim(), role });
    setPage("Dashboard");
    notify("Welcome to CareCircle!");
  };

  const logout = () => {
    setUser(null);
    setPage("Dashboard");
    notify("You have logged out.");
  };

  const toggleMedicine = id => {
    updateData("medicines", data.medicines.map(m =>
      m.id === id ? { ...m, taken: !m.taken } : m
    ));
    notify("Medicine status updated.");
  };

  const addMedicine = e => {
    e.preventDefault();
    if (!medicineForm.name || !medicineForm.dose || !medicineForm.time) {
      return notify("Please complete all medicine fields.");
    }
    updateData("medicines", [
      ...data.medicines,
      { ...medicineForm, id: Date.now(), taken: false }
    ]);
    setMedicineForm({ name: "", dose: "", time: "" });
    notify("Medicine added.");
  };

  const addAppointment = e => {
    e.preventDefault();
    if (!appointmentForm.doctor || !appointmentForm.date) {
      return notify("Enter doctor and date.");
    }
    updateData("appointments", [
      ...data.appointments,
      { ...appointmentForm, id: Date.now() }
    ]);
    setAppointmentForm({ doctor: "", type: "", date: "", time: "" });
    notify("Appointment added.");
  };

  const addRecord = e => {
    e.preventDefault();
    if (!recordForm.name) return notify("Enter a document name.");
    updateData("records", [
      ...data.records,
      { ...recordForm, id: Date.now() }
    ]);
    setRecordForm({ name: "", date: "", type: "Medical Report" });
    notify("Record added.");
  };

  const completed = data.medicines.filter(m => m.taken).length;
  const percent = data.medicines.length
    ? Math.round(completed / data.medicines.length * 100)
    : 0;

  const navItems = user?.role === "Family"
    ? [["Dashboard", "⌂"], ["Care Updates", "♡"], ["Medicines", "✚"], ["Appointments", "▣"], ["Caregivers", "♧"], ["Care Notes", "✎"]]
    : user?.role === "Caregiver"
      ? [["Dashboard", "⌂"], ["Care Tasks", "✓"], ["Appointments", "▣"], ["Care Notes", "✎"], ["Profile", "♙"]]
      : [["Dashboard", "⌂"], ["Medicines", "✚"], ["Appointments", "▣"], ["Health Records", "▤"], ["Find Caregivers", "♧"], ["Emergency Card", "♥"], ["Profile", "♙"]];

  const Header = () => (
    <header className="cc-header">
      <div className="cc-logo">
        <div className="cc-logo-mark">♡</div>
        CareCircle
      </div>

      <div className="cc-header-right">
        <button
          type="button"
          className="cc-btn cc-btn-light"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {user ? (
          <>
            <span className="cc-muted">Hello, {user.name.split(" ")[0]}</span>
            <div className="cc-user">{user.name.charAt(0).toUpperCase()}</div>
            <button type="button" className="cc-btn cc-btn-light" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <button
            type="button"
            className="cc-btn cc-btn-light"
            onClick={() => setPage("Login")}
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );

  const Stat = ({ icon, value, label }) => (
    <div className="cc-stat">
      <div className="cc-stat-icon">{icon}</div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );

  const MedicineList = () => (
    <div className="cc-card">
      <div className="cc-card-head">
        <div>
          <h2>Medicine schedule</h2>
          <div className="cc-muted">Today's medicine checklist</div>
        </div>
        <span className="cc-pill">{completed}/{data.medicines.length} done</span>
      </div>

      <div className="cc-progress">
        <div style={{ width: percent + "%" }} />
      </div>

      {data.medicines.map(m => (
        <div className="cc-row" key={m.id}>
          <div>
            <div className="cc-row-title">{m.name}</div>
            <div className="cc-row-sub">{m.dose} · {m.time}</div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <input
              className="cc-check"
              type="checkbox"
              checked={m.taken}
              onChange={() => toggleMedicine(m.id)}
            />
            {m.taken ? "Confirmed" : "Confirm"}
          </label>
        </div>
      ))}

      {!data.medicines.length && <div className="cc-empty">No medicines added yet.</div>}
    </div>
  );

  const AppointmentList = () => (
    <div className="cc-card">
      <div className="cc-card-head">
        <div>
          <h2>Upcoming appointments</h2>
          <div className="cc-muted">Keep track of important visits</div>
        </div>
        <button className="cc-btn cc-btn-light" onClick={() => setPage("Appointments")}>
          View all
        </button>
      </div>

      {data.appointments.slice(0, 3).map(a => (
        <div className="cc-row" key={a.id}>
          <div>
            <div className="cc-row-title">{a.type || "Appointment"}</div>
            <div className="cc-row-sub">
              {a.doctor} · {a.date} {a.time && "· " + a.time}
            </div>
          </div>
          <span className="cc-pill">Scheduled</span>
        </div>
      ))}

      {!data.appointments.length && <div className="cc-empty">No appointments scheduled.</div>}
    </div>
  );

  const Checkin = () => (
    <div className="cc-card">
      <h2>How are you feeling today?</h2>
      <p className="cc-muted">A small check-in helps your care circle stay connected.</p>

      <div className="cc-big-checkin">
        <div className="cc-checkin-options">
          {["Good", "Tired", "Unwell", "Need Help"].map(v => (
            <button
              key={v}
              className={data.checkin === v ? "selected" : ""}
              onClick={() => {
                updateData("checkin", v);
                notify("Your check-in was updated.");
              }}
            >
              {v === "Good" ? "😊 " : v === "Tired" ? "😴 " : v === "Unwell" ? "🤒 " : "🆘 "}{v}
            </button>
          ))}
        </div>
        <p>Current update: <strong>{data.checkin}</strong></p>
      </div>
    </div>
  );

  const EmergencyCard = () => (
    <div className="cc-emergency">
      <h3>♥ Emergency information</h3>
      <p>Keep important contacts accessible. This demo does not contact emergency services.</p>
      <div className="cc-row">
        <span>Emergency contact</span>
        <strong>Family member</strong>
      </div>
      <div className="cc-row">
        <span>Emergency number</span>
        <strong>112</strong>
      </div>
      <button
        className="cc-btn cc-btn-danger"
        style={{ width: "100%", marginTop: 12 }}
        onClick={() => notify("Demo only: no emergency call was placed.")}
      >
        Request emergency help
      </button>
    </div>
  );

  const CaregiverList = () => (
    <div className="cc-card">
      <div className="cc-card-head">
        <div>
          <h2>Caregiver connections</h2>
          <div className="cc-muted">Explore care support options</div>
        </div>
        <button className="cc-btn cc-btn-light" onClick={() => setPage("Find Caregivers")}>
          Explore
        </button>
      </div>

      {caregivers.slice(0, 2).map(c => (
        <div className="cc-caregiver" key={c.id}>
          <div className="cc-avatar">{c.initials}</div>
          <div style={{ flex: 1 }}>
            <div className="cc-row-title">{c.name}</div>
            <div className="cc-row-sub">{c.role} · {c.experience}</div>
          </div>
          <span className="cc-pill">★ {c.rating}</span>
        </div>
      ))}
    </div>
  );

  const Dashboard = () => {
    if (user.role === "Family") {
      return (
        <>
          <div className="cc-welcome">
            <div>
              <h1>Family dashboard</h1>
              <div className="cc-muted">Stay connected with your loved one's care.</div>
            </div>
            <span className="cc-pill">Family view</span>
          </div>

          <div className="cc-grid">
            {Stat({ icon: "♡", value: data.checkin, label: "Latest wellbeing check-in" })}
            {Stat({ icon: "✚", value: `${completed}/${data.medicines.length}`, label: "Medicines confirmed" })}
            {Stat({ icon: "▣", value: data.appointments.length, label: "Upcoming appointments" })}
            {Stat({ icon: "♧", value: requests.length, label: "Caregiver requests" })}
          </div>

          <div className="cc-columns">
            <div>{Checkin()}{MedicineList()}</div>
            <div>
              {AppointmentList()}
              <div className="cc-alert">
                A medicine not yet confirmed is shown as pending. It does not automatically mean it was missed.
              </div>
            </div>
          </div>
        </>
      );
    }

    if (user.role === "Caregiver") {
      return (
        <>
          <div className="cc-welcome">
            <div>
              <h1>Caregiver dashboard</h1>
              <div className="cc-muted">Your care tasks and daily handover.</div>
            </div>
            <span className="cc-pill">Caregiver view</span>
          </div>

          <div className="cc-grid">
            {Stat({ icon: "✓", value: "3", label: "Sample care tasks" })}
            {Stat({ icon: "▣", value: data.appointments.length, label: "Appointments listed" })}
            {Stat({ icon: "♡", value: data.checkin, label: "Patient check-in" })}
            {Stat({ icon: "✎", value: "1", label: "Care notes" })}
          </div>

          <div className="cc-columns">
            <div className="cc-card">
              <h2>Today's care tasks</h2>
              {["Check medicine schedule", "Ask about daily wellbeing", "Review upcoming appointment"].map((t, i) => (
                <div className="cc-row" key={t}>
                  <span className="cc-row-title">{t}</span>
                  <span className="cc-pill">{i === 0 ? "Pending" : "Planned"}</span>
                </div>
              ))}
            </div>
            <div>
              {Checkin()}
              <div className="cc-alert">
                Care tasks are sample items for this demonstration. Confirm details with the patient or family.
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="cc-welcome">
          <div>
            <h1>Good day, {user.name.split(" ")[0]} 👋</h1>
            <div className="cc-muted">Your care, your choices, your circle.</div>
          </div>
          <span className="cc-pill">Patient view</span>
        </div>

        <div className="cc-grid">
          {Stat({ icon: "✚", value: `${completed}/${data.medicines.length}`, label: "Medicines confirmed" })}
          {Stat({ icon: "▣", value: data.appointments.length, label: "Appointments scheduled" })}
          {Stat({ icon: "▤", value: data.records.length, label: "Health records listed" })}
          {Stat({ icon: "♡", value: data.checkin, label: "Today's wellbeing" })}
        </div>

        <div className="cc-columns">
          <div>{MedicineList()}{AppointmentList()}</div>
          <div>{Checkin()}{EmergencyCard()}{CaregiverList()}</div>
        </div>
      </>
    );
  };

  const Content = () => {
    switch (page) {
      case "Dashboard":
        return Dashboard();

      case "Medicines":
        return (
          <div className="cc-section">
            <div className="cc-welcome">
              <div>
                <h1>Medicine schedule</h1>
                <div className="cc-muted">Keep track of your daily medicines.</div>
              </div>
            </div>

            {MedicineList()}

            <div className="cc-card">
              <h2>Add a medicine</h2>
              <form onSubmit={addMedicine}>
                <div className="cc-form-grid">
                  <div className="cc-field">
                    <label>Medicine name</label>
                    <input
                      value={medicineForm.name}
                      onChange={e => setMedicineForm({ ...medicineForm, name: e.target.value })}
                      placeholder="e.g. Vitamin D"
                    />
                  </div>
                  <div className="cc-field">
                    <label>Dose</label>
                    <input
                      value={medicineForm.dose}
                      onChange={e => setMedicineForm({ ...medicineForm, dose: e.target.value })}
                      placeholder="e.g. 1 tablet"
                    />
                  </div>
                  <div className="cc-field">
                    <label>Time</label>
                    <input
                      type="time"
                      value={medicineForm.time}
                      onChange={e => setMedicineForm({ ...medicineForm, time: e.target.value })}
                    />
                  </div>
                </div>
                <button className="cc-btn">Add medicine</button>
              </form>
            </div>
          </div>
        );

      case "Appointments":
        return (
          <div className="cc-section">
            <div className="cc-welcome">
              <div>
                <h1>Appointments</h1>
                <div className="cc-muted">Keep important visits organized.</div>
              </div>
            </div>

            <div className="cc-card">
              {data.appointments.map(a => (
                <div className="cc-row" key={a.id}>
                  <div>
                    <div className="cc-row-title">{a.type || "Appointment"}</div>
                    <div className="cc-row-sub">{a.doctor} · {a.date} · {a.time}</div>
                  </div>
                  <button
                    className="cc-btn cc-btn-danger"
                    onClick={() => {
                      updateData("appointments", data.appointments.filter(x => x.id !== a.id));
                      notify("Appointment removed.");
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {!data.appointments.length && <div className="cc-empty">No appointments yet.</div>}
            </div>

            <div className="cc-card">
              <h2>Add an appointment</h2>
              <form onSubmit={addAppointment}>
                <div className="cc-form-grid">
                  <div className="cc-field">
                    <label>Doctor's name</label>
                    <input
                      placeholder="Doctor's name"
                      value={appointmentForm.doctor}
                      onChange={e => setAppointmentForm({ ...appointmentForm, doctor: e.target.value })}
                    />
                  </div>
                  <div className="cc-field">
                    <label>Appointment type</label>
                    <input
                      placeholder="e.g. General checkup"
                      value={appointmentForm.type}
                      onChange={e => setAppointmentForm({ ...appointmentForm, type: e.target.value })}
                    />
                  </div>
                  <div className="cc-field">
                    <label>Date</label>
                    <input
                      type="date"
                      value={appointmentForm.date}
                      onChange={e => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    />
                  </div>
                  <div className="cc-field">
                    <label>Time</label>
                    <input
                      type="time"
                      value={appointmentForm.time}
                      onChange={e => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    />
                  </div>
                </div>
                <button className="cc-btn">Save appointment</button>
              </form>
            </div>
          </div>
        );

      case "Health Records":
        return (
          <div className="cc-section">
            <div className="cc-welcome">
              <div>
                <h1>Health records</h1>
                <div className="cc-muted">A simple list of important health documents.</div>
              </div>
            </div>

            <div className="cc-alert">
              Demo limitation: this prototype stores document names only. It does not upload or securely store medical files.
            </div>

            <div className="cc-card" style={{ marginTop: 18 }}>
              <h2>My documents</h2>
              {data.records.map(r => (
                <div className="cc-record" key={r.id}>
                  <div className="cc-record-icon">▤</div>
                  <div style={{ flex: 1 }}>
                    <div className="cc-row-title">{r.name}</div>
                    <div className="cc-row-sub">{r.type} · {r.date || "Date not provided"}</div>
                  </div>
                  <button
                    className="cc-btn cc-btn-danger"
                    onClick={() => {
                      updateData("records", data.records.filter(x => x.id !== r.id));
                      notify("Record removed.");
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {!data.records.length && <div className="cc-empty">No records added yet.</div>}
            </div>

            <div className="cc-card">
              <h2>Add a record</h2>
              <form onSubmit={addRecord}>
                <div className="cc-form-grid">
                  <div className="cc-field">
                    <label>Document name</label>
                    <input
                      placeholder="e.g. Blood test report"
                      value={recordForm.name}
                      onChange={e => setRecordForm({ ...recordForm, name: e.target.value })}
                    />
                  </div>
                  <div className="cc-field">
                    <label>Document type</label>
                    <select
                      value={recordForm.type}
                      onChange={e => setRecordForm({ ...recordForm, type: e.target.value })}
                    >
                      <option>Medical Report</option>
                      <option>Prescription</option>
                      <option>Lab Report</option>
                      <option>Discharge Summary</option>
                    </select>
                  </div>
                  <div className="cc-field">
                    <label>Date</label>
                    <input
                      type="date"
                      value={recordForm.date}
                      onChange={e => setRecordForm({ ...recordForm, date: e.target.value })}
                    />
                  </div>
                </div>
                <button className="cc-btn">Add record</button>
              </form>
            </div>
          </div>
        );

      case "Find Caregivers":
      case "Caregivers":
        return (
          <div className="cc-section">
            <div className="cc-welcome">
              <div>
                <h1>Find a caregiver</h1>
                <div className="cc-muted">Explore care support options for your family.</div>
              </div>
            </div>

            <div className="cc-field">
              <label>Search caregivers</label>
              <input
                placeholder="Search by name or role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="cc-alert">
              These are sample profiles for the prototype, not verified professionals. Requests are demo-only.
            </div>

            <div className="cc-card" style={{ marginTop: 18 }}>
              {caregivers
                .filter(c => (c.name + c.role).toLowerCase().includes(search.toLowerCase()))
                .map(c => (
                  <div className="cc-caregiver" key={c.id}>
                    <div className="cc-avatar">{c.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div className="cc-row-title">{c.name}</div>
                      <div className="cc-row-sub">{c.role} · {c.experience}</div>
                      <div className="cc-row-sub">Sample rating: ★ {c.rating}</div>
                    </div>
                    <button
                      className="cc-btn"
                      onClick={() => {
                        setRequests(prev => [...prev, c.name]);
                        notify("Demo request sent for " + c.name);
                      }}
                    >
                      Request
                    </button>
                  </div>
                ))}

              {!caregivers.some(c => (c.name + c.role).toLowerCase().includes(search.toLowerCase())) && (
                <div className="cc-empty">No matching caregivers found.</div>
              )}
            </div>
          </div>
        );

      case "Care Updates":
      case "Care Tasks":
        return (
          <div className="cc-section">
            <div className="cc-welcome">
              <div>
                <h1>Care updates</h1>
                <div className="cc-muted">Shared updates for the care circle.</div>
              </div>
            </div>

            <div className="cc-grid">
              {Stat({ icon: "♡", value: data.checkin, label: "Latest wellbeing check-in" })}
              {Stat({ icon: "✚", value: `${completed}/${data.medicines.length}`, label: "Medicines confirmed" })}
              {Stat({ icon: "▣", value: data.appointments.length, label: "Appointments" })}
              {Stat({ icon: "♧", value: requests.length, label: "Demo care requests" })}
            </div>

            {Checkin()}
            {MedicineList()}
            {AppointmentList()}
          </div>
        );

      case "Care Notes":
        return (
          <div className="cc-section">
            <div className="cc-welcome">
              <div>
                <h1>Care handover notes</h1>
                <div className="cc-muted">Share useful day-to-day observations with the care circle.</div>
              </div>
            </div>

            <div className="cc-card">
              <h2>Daily care note</h2>
              <div className="cc-field">
                <label>Notes for family or the next caregiver</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Write a care update..."
                />
              </div>
              <button
                className="cc-btn"
                onClick={() => {
                  updateData("notes", notes);
                  notify("Care notes saved.");
                }}
              >
                Save notes
              </button>
              <p className="cc-muted">Saved demo note: {data.notes}</p>
            </div>
          </div>
        );

      case "Emergency Card":
        return (
          <div className="cc-section">
            <div className="cc-welcome">
              <div>
                <h1>Emergency card</h1>
                <div className="cc-muted">Important information to keep accessible.</div>
              </div>
            </div>

            {EmergencyCard()}

            <div className="cc-card" style={{ marginTop: 18 }}>
              <h2>Emergency information</h2>
              <p className="cc-muted">
                Sample information only. Replace with accurate details after obtaining consent.
              </p>
              <div className="cc-row"><span>Name</span><strong>{user.name}</strong></div>
              <div className="cc-row"><span>Email</span><strong>{user.email}</strong></div>
              <div className="cc-row"><span>Emergency number (India)</span><strong>112</strong></div>
            </div>
          </div>
        );

      case "Profile":
        return (
          <div className="cc-section">
            <div className="cc-welcome">
              <div>
                <h1>My profile</h1>
                <div className="cc-muted">Your CareCircle account details.</div>
              </div>
            </div>

            <div className="cc-card">
              <div className="cc-avatar" style={{ width: 65, height: 65, fontSize: 24 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="cc-row"><span>Name</span><strong>{user.name}</strong></div>
              <div className="cc-row"><span>Email</span><strong>{user.email}</strong></div>
              <div className="cc-row"><span>Role</span><strong>{user.role}</strong></div>
              <button className="cc-btn cc-btn-danger" style={{ marginTop: 20 }} onClick={logout}>
                Log out
              </button>
            </div>
          </div>
        );

      default:
        return Dashboard();
    }
  };

  return (
    <div className={`cc ${darkMode ? "dark" : ""}`}>
      <style>{styles}</style>
      {Header()}

      {!user ? (
        page === "Login" ? (
          <div className="cc-login-wrap">
            <form className="cc-login" onSubmit={login}>
              <div className="cc-logo" style={{ marginBottom: 25 }}>
                <div className="cc-logo-mark">♡</div>
                CareCircle
              </div>

              <h1>Welcome to your care circle</h1>
              <p className="cc-muted">Choose your role and enter your details to explore the demo.</p>

              <div className="cc-role-grid">
                {["Patient", "Family", "Caregiver"].map(r => (
                  <button
                    type="button"
                    key={r}
                    className={"cc-role " + (role === r ? "selected" : "")}
                    onClick={() => setRole(r)}
                  >
                    {r === "Patient" ? "♡" : r === "Family" ? "♧" : "✚"}<br />{r}
                  </button>
                ))}
              </div>

              <div className="cc-field">
                <label>Your name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="cc-field">
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button className="cc-btn" style={{ width: "100%" }}>
                Enter CareCircle →
              </button>

              <p className="cc-muted" style={{ marginTop: 15, fontSize: 11 }}>
                Demo sign-in only. No password or real account is created.
              </p>

              <button
                type="button"
                className="cc-btn cc-btn-light"
                style={{ width: "100%", marginTop: 10 }}
                onClick={() => setPage("Home")}
              >
                Back to home
              </button>
            </form>
          </div>
        ) : (
          <>
           
           <main className="cc-landing" id="home">
  <section className="cc-hero">
    <div className="cc-hero-copy">
      <div className="cc-eyebrow">♥ Your Health. Our Priority</div>
      <h1>CareCircle</h1>
      <p>
        A smart and caring healthcare companion for you and your loved ones.
      </p>
      <div className="cc-hero-actions">
        <button className="cc-btn" onClick={() => setPage("Login")}>
          Get Started →
        </button>
        <a className="cc-learn-link" href="#features">Learn More ↓</a>
      </div>
    </div>
    <div className="cc-hero-decor cc-decor-one">＋</div>
    <div className="cc-hero-decor cc-decor-two">♡</div>
  </section>

  <section className="cc-features" id="features">
    <div className="cc-feature">
      <div className="cc-feature-icon">▦</div>
      <h3>Smart Appointments</h3>
      <p>Book and manage appointments easily.</p>
    </div>
    <div className="cc-feature">
      <div className="cc-feature-icon">✚</div>
      <h3>Medicine Reminders</h3>
      <p>Never miss a dose again.</p>
    </div>
    <div className="cc-feature">
      <div className="cc-feature-icon">♡</div>
      <h3>Health Records</h3>
      <p>Keep track of your health history securely.</p>
    </div>
  </section>

  <section className="cc-about" id="about">
    <div className="cc-about-art">
      <div className="cc-about-orbit">♡</div>
      <div className="cc-about-cross">＋</div>
      <div className="cc-about-heart">♥</div>
    </div>

    <div className="cc-about-copy">
      <div className="cc-section-kicker">About CareCircle</div>
      <h2>A Health Companion for Life</h2>
      <p>
        CareCircle helps you manage appointments, medicines, and health
        records with ease — anytime, anywhere.
      </p>

      <div className="cc-benefits">
        <div>
          <span>✓</span>
          <div>
            <strong>Secure &amp; Private</strong>
            <small>Your care information stays organized.</small>
          </div>
        </div>
        <div>
          <span>⌂</span>
          <div>
            <strong>For You &amp; Your Family</strong>
            <small>Keep the people involved in your care connected.</small>
          </div>
        </div>
        <div>
          <span>▣</span>
          <div>
            <strong>Access Anywhere</strong>
            <small>Stay up to date across your everyday devices.</small>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section className="cc-join-banner" id="contact">
    <div className="cc-join-brand">
      <span className="cc-logo-mark">♥</span>
      <strong>CareCircle</strong>
    </div>
    <p>Let's build a healthier, happier tomorrow together.</p>
    <button className="cc-btn cc-btn-navy" onClick={() => setPage("Login")}>
      Join CareCircle →
    </button>
  </section>
</main>

<footer className="cc-footer">
  CareCircle · Care with dignity, connection and trust.
</footer>
          </>
        )
      ) : (
        <div className="cc-layout">
          <aside className="cc-sidebar">
            <div className="cc-side-label">WORKSPACE</div>

            {navItems.map(([label, icon]) => (
              <button
                key={label}
                className={"cc-nav " + (page === label ? "active" : "")}
                onClick={() => setPage(label)}
              >
                <span className="cc-nav-icon">{icon}</span>{label}
              </button>
            ))}

            <div className="cc-side-label" style={{ marginTop: 25 }}>ACCOUNT</div>

            <button
              className={"cc-nav " + (page === "Profile" ? "active" : "")}
              onClick={() => setPage("Profile")}
            >
              <span className="cc-nav-icon">♙</span>My profile
            </button>

            <button className="cc-nav" onClick={logout}>
              <span className="cc-nav-icon">↪</span>Log out
            </button>
          </aside>

          <main className="cc-main">{Content()}</main>
        </div>
      )}

      {toast && <div className="cc-toast">{toast}</div>}
    </div>
  );
}
