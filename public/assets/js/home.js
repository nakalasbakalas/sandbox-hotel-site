/* ==========================================================
  Sandbox Hotel — Homepage JavaScript (extracted from index.html)
========================================================== */
    // =========================
    // CONFIG (EDIT THESE)
    // =========================
    const WHATSAPP_NUMBER_E164 = "66885783478";                  // no "+"
    const LINE_LINK = "https://line.me/ti/p/uc4BCpHCQ4";
    const EMAIL_TO = "booking@sandboxhotel.com";
    // =========================

    
    // ---------- Theme (System default; user override saved) ----------
    const THEME_KEY = "sbx_theme"; // "system" | "dark" | "light"
    const metaTheme = document.getElementById("metaThemeColor");
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const themeLabel = document.getElementById("themeLabel");

    function resolvedSystemTheme(){
      return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    }
    function applyMetaThemeColor(mode){
      if(!metaTheme) return;
      const resolved = (mode === "system") ? resolvedSystemTheme() : mode;
      metaTheme.setAttribute("content", resolved === "dark" ? "#0B0C0F" : "#FFFFFF");
    }
    function setTheme(mode){
      const html = document.documentElement;
      const safe = (mode === "dark" || mode === "light" || mode === "system") ? mode : "system";
      html.setAttribute("data-theme", safe);
      applyMetaThemeColor(safe);

      if(themeIcon && themeLabel){
        if(safe === "system"){ themeIcon.textContent = "🖥️"; themeLabel.textContent = "System"; }
        else if(safe === "dark"){ themeIcon.textContent = "🌙"; themeLabel.textContent = "Dark"; }
        else { themeIcon.textContent = "☀️"; themeLabel.textContent = "Light"; }
      }
    }
    function initTheme(){
      let mode = "system";
      try{
        const stored = localStorage.getItem(THEME_KEY);
        if(stored) mode = stored;
      }catch(_e){}
      setTheme(mode);

      if(window.matchMedia){
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        mq.addEventListener?.("change", ()=>{
          if(document.documentElement.getAttribute("data-theme") === "system"){
            applyMetaThemeColor("system");
          }
        });
      }

      if(themeToggle){
        themeToggle.addEventListener("click", ()=>{
          const current = document.documentElement.getAttribute("data-theme") || "system";
          const next = current === "system" ? "dark" : (current === "dark" ? "light" : "system");
          try{ localStorage.setItem(THEME_KEY, next); }catch(_e){}
          setTheme(next);
        });
      }
    }

    // ---------- i18n ----------
    const I18N_DEFAULT = "th";
    let CURRENT_LANG = I18N_DEFAULT;

    const I18N = {
      th: {
        meta_title: "โรงแรมในนครศรีธรรมราช | Sandbox Hotel จองตรงรับราคาพิเศษ",
        meta_desc: "Sandbox Hotel โรงแรมบูติกในนครศรีธรรมราช ห้องพักกว้างขวาง ส่วนตัว เงียบสงบ จองตรงกับโรงแรมผ่านโทรหรือ LINE รับประกันราคาดีที่สุดและบริการส่วนตัว",
        og_title: "โรงแรมบูติกในนครศรีธรรมราช | Sandbox Hotel",
        og_desc: "ที่พักส่วนตัวสำหรับผู้เดินทางที่ใส่ใจคุณภาพ ห้องพักเงียบสงบ Wi-Fi เร็ว ที่จอดรถ บริการใส่ใจทุกรายละเอียด จองตรงรับราคาพิเศษ",
        brand_location: "นครศรีธรรมราช ประเทศไทย",
        nav_support: "ราคาดีเมื่อจองตรง",
        nav_line_cta: "LINE",
        nav_book: "เช็คห้องว่าง",
        nav_call_hotel: "โทรหาโรงแรม",
        nav_line_chat: "แชตผ่าน LINE",
        nav_language: "ภาษา",
        nav_rooms: "ห้องพัก",
        nav_offers: "ข้อเสนอ",
        nav_amenities: "สิ่งอำนวยความสะดวก",
        nav_gallery: "แกลเลอรี",
        nav_reviews: "รีวิว",
        nav_faq: "คำถาม",
        nav_location: "ที่ตั้ง",

        hero_kicker: '<span class="kw a">จองตรงราคาพิเศษ</span> <span class="sep-dot">•</span> <span class="kw">บริการส่วนตัว</span> <span class="sep-dot">•</span> <span class="kw hot">คลิกเพื่อจอง</span>',
        hero_kicker_short: "Sandbox Hotel • ที่พักบูติกสงบใจกลางนครศรี",
        hero_title: "ที่พักสงบ ห้องกว้าง<br>ในนครศรีธรรมราช",
        hero_sub: 'ห้องกว้างส่วนตัว • Wi-Fi เร็ว • ที่จอดรถ • ซักรีด • แอร์<br>บริการใส่ใจ: โทรหรือ LINE ได้ตลอด',
        hero_sub_short: "โรงแรมบูติกที่ให้ความสบายแบบเป็นส่วนตัว จองตรงง่าย และเดินทางในเมืองสะดวก",
        hero_fine: 'เช็คอิน <b>14:00</b> • เช็คเอาต์ <b>11:00</b> • กรุณาแสดงพาสปอร์ต/บัตรประชาชน • ห้องเงียบ',

        cta_request: "เช็คห้องว่าง",
        cta_check_direct_rate: "เช็คห้องว่างและราคา",
        cta_call_hotel: "โทรหาโรงแรม",
        cta_call_line: "โทรเลย",
        cta_call_number: "โทร: 088-578-3478",
        cta_email: "อีเมล",
        cta_open_map: "เปิดแผนที่",
        hero_view_rooms: "ดูห้องพัก →",
        hero_review_count: "· รีวิวบน Google",
        trust_rating: "4.8",
        trust_meta: "อ้างอิงจากรีวิวบน Google Maps",
        hero_direct_booking_benefit: "จองตรงกับโรงแรมเพื่อรับราคาที่ดีที่สุดและการยืนยันที่รวดเร็ว",
        hero_contact_hint: "โทรหรือ LINE หาเราได้โดยตรงเพื่อยืนยันห้องว่างได้เร็วที่สุด",
        hero_proof_rooms: "ห้องพักขนาด 28 ตร.ม.",
        hero_proof_parking: "ที่จอดรถ + Wi‑Fi เร็ว",
        hero_proof_location: "พักสงบ เดินทางในเมืองสะดวก",
        trust_direct: "จองตรงราคาดีที่สุด",
        trust_rooms: "ห้องพักกว้าง",
        trust_quiet: "ห้องเงียบพักผ่อนได้จริง",
        trust_wifi: "Wi‑Fi ความเร็วสูง",
        trust_parking: "ที่จอดรถในที่พัก",
        trust_support: "บริการส่วนตัว",

        offers_title: "สิ่งที่ทำให้ Sandbox พิเศษ",
        offers_sub: "ที่พักที่ออกแบบมาเพื่อความสงบ ส่วนตัว และใส่ใจทุกรายละเอียด",
        offers_btn: "เช็คห้องว่าง",
        offer1_title: 'จองตรง ประหยัดกว่า',
        offer1_desc: "ติดต่อโดยตรง ไร้นายหน้า รับราคาพิเศษ — ยืนยันรวดเร็วผ่าน LINE หรือโทร",
        offer2_title: 'ห้องพักสบาย ทำงานหรือพักผ่อนได้',
        offer2_desc: "ห้องพักขนาด 28 ตร.ม. พร้อมโต๊ะทำงาน แอร์ ฝักบัวน้ำอุ่น ขอฝั่งเงียบได้ตามต้องการ",
        offer3_title: 'Wi-Fi เร็วและเสถียร',
        offer3_desc: "อินเทอร์เน็ตความเร็วดีสำหรับทำงาน ดูสตรีม และใช้งานตลอดการเข้าพัก",
        offer4_title: 'ที่จอดรถ & เข้าถึงง่าย',
        offer4_desc: "มีที่จอดรถในที่พัก ทำเลใจกลางเมือง เดินทางสะดวก",
        offer5_title: 'บริการช่วยเหลือจากท้องถิ่น',
        offer5_desc: "พนักงานยินดีช่วยเหลือทุกวัน พร้อมแนะนำสถานที่ท้องถิ่น",
        offer6_title: 'ราคาพิเศษรายสัปดาห์ & รายเดือน',
        offer6_desc: "พักยาว? สอบถามราคาพิเศษสำหรับการพักรายสัปดาห์และรายเดือน",
        faq_cta_text: "ยังมีคำถาม? เรายินดีช่วยเหลือค่ะ",

        book_title: "เช็คห้องว่างโดยตรงกับโรงแรม",
        book_sub: 'แจ้ง<span class="kw a">วันเข้าพัก</span>และ<span class="kw">ประเภทห้อง</span> จากนั้นเลือกช่องทางติดต่อที่สะดวก แล้วเราจะตอบกลับพร้อมห้องว่าง ราคา และขั้นตอนถัดไป',
        book_callnow: "โทรหาโรงแรม",
        book_process_label: "ขั้นตอนการจองตรง",
        book_process_step_1: "เลือกวันเข้าพักและประเภทห้องที่ต้องการ",
        book_process_step_2: "ส่งคำถามผ่าน LINE, WhatsApp หรืออีเมล",
        book_process_step_3: "เราตอบกลับพร้อมห้องว่าง ราคาจองตรง และขั้นตอนถัดไป",
        book_channel_hint: "ต้องการคำตอบเร็วที่สุด แนะนำโทรหรือ LINE ส่วนอีเมลเหมาะกับคำขอละเอียด",

        lbl_checkin: "เช็คอิน",
        lbl_checkout: "เช็คเอาต์",
        lbl_guests: "ผู้เข้าพัก",
        lbl_room: "ห้องพัก",
        lbl_name: "ชื่อ",
        lbl_contact: "ติดต่อ (โทร/อีเมล)",
        lbl_notes: "หมายเหตุ",
        ph_name: "ชื่อของคุณ",
        ph_contact: "+66 … หรืออีเมล",
        ph_notes: "เวลาเข้าถึง, คำขอพิเศษ ฯลฯ",
        btn_send_line: "ส่งผ่าน LINE",
        btn_send_wa: "ส่งผ่าน WhatsApp",
        btn_send_email: "ส่งผ่านอีเมล",
        btn_send_line_short: "LINE",
        btn_send_wa_short: "WhatsApp",
        book_checkin_info: "เช็คอิน: ตั้งแต่ 14:00 · เช็คเอาท์: ก่อน 11:00",
        book_id_note: "ต้องแสดงบัตรประชาชนหรือพาสปอร์ตเมื่อเช็คอิน",
        form_hint: "เราจะตอบกลับพร้อมห้องว่าง ราคา และขั้นตอนถัดไป",
        form_hint_extended: "เลือกช่องทางติดต่อที่สะดวก แล้วเราจะตอบกลับพร้อมห้องว่าง ราคาจองตรง และขั้นตอนถัดไปโดยเร็วที่สุด",
        form_validation_summary: "กรุณาตรวจสอบช่องที่ไฮไลต์ไว้ เพื่อให้เราจัดเตรียมคำขอของคุณได้ถูกต้อง",
        form_status_line: "เปิด LINE พร้อมข้อความแล้ว ส่งต่อในแชตได้เลย แล้วเราจะตอบกลับพร้อมห้องว่างและราคา",
        form_status_whatsapp: "เปิด WhatsApp พร้อมข้อความแล้ว ส่งต่อได้เลย แล้วเราจะตอบกลับพร้อมห้องว่างและราคา",
        form_status_email: "เปิดอีเมลพร้อมข้อความแล้ว กดส่งเมื่อพร้อม แล้วเราจะตอบกลับพร้อมห้องว่างและราคา",
        field_hint_checkin: "เลือกวันเช็คอิน",
        field_hint_checkout: "เลือกวันเช็คเอาต์",
        field_hint_guests: "แจ้งจำนวนผู้เข้าพัก",
        field_hint_room: "เลือกประเภทห้องที่อยากให้เราเช็กก่อน",
        field_hint_name: "ไม่จำเป็น แต่ช่วยให้เราตอบกลับได้เป็นกันเองขึ้น",
        field_hint_contact: "กรอกเบอร์โทรหรืออีเมลเพื่อให้เราติดต่อกลับได้โดยตรง",
        field_hint_notes: "ถ้ามีเวลาเดินทาง ความต้องการพิเศษ หรือคำถามเพิ่มเติม ใส่ได้ที่นี่",
        validation_required_prefix: "กรุณากรอก",
        validation_checkout_after_checkin: "วันเช็คเอาต์ต้องหลังวันเช็คอิน",

        quick_label: "เลือกวันอย่างรวดเร็ว",
        quick_tonight: "คืนนี้",
        quick_tomorrow: "พรุ่งนี้",
        quick_weekend: "สุดสัปดาห์",
        quick_7n: "7 คืน",
        quick_clear: "ล้าง",
        stay_summary_placeholder: "เลือกวันเพื่อดูสรุปการเข้าพัก",
        stay_nights: "คืน",
        stay_guests: "ท่าน",
        stay_room: "ห้อง",
        best_rate_note: "จองตรง = ยืนยันไวที่สุด • ส่งวันเข้าพักเพื่อรับราคาจองตรงของวันนี้",
        msg_nights: "จำนวนคืน",
        line_opened_hint: "เปิด LINE แล้ว",
        line_clipboard_hint: "คัดลอกข้อความไว้แล้ว (วางได้ทันที)",
        line_clipboard_fail: "แนะนำ: คัดลอกข้อความหากต้องการวางในแชต",
        msg_intro: "สวัสดีค่ะ/ครับ อยากเช็กห้องว่างและราคาจองตรง",
        why_title: "ทำไมแขกถึงเลือก Sandbox",
        why_sub: "เรียบง่าย น่าเชื่อถือ และจองตรงได้สะดวก",
        why_1_t: "ห้องกว้าง",
        why_1_d: "พื้นที่สบายสำหรับพักผ่อนหรือทำงาน",
        why_2_t: "ยืนยันรวดเร็ว",
        why_2_d: "โทรหรือส่งข้อความแจ้งวันและประเภทห้อง",
        why_3_t: "ครบทุกสิ่งจำเป็น",
        why_3_d: "Wi‑Fi แอร์ ที่จอดรถ ซักรีด และบริการช่วยเหลือ",
        btn_view_facebook: 'Facebook<span class="sr-only"> (เปิดในแท็บใหม่)</span>',
        faq_q7: "สูบบุหรี่ได้ไหม?",
        faq_a7: "เพื่อความสบายของผู้เข้าพัก โปรดสอบถามนโยบายการสูบบุหรี่และพื้นที่ที่กำหนดกับแผนกต้อนรับ",
        faq_q8: "นโยบายการยกเลิกคืออะไร?",
        faq_a8: "เงื่อนไขการยกเลิกอาจเปลี่ยนตามช่วงเวลา/ฤดูกาล กรุณายืนยันกับโรงแรมตามวันเข้าพักของคุณ",
        faq_q9: "Sandbox Hotel อยู่ที่ไหนในนครศรีธรรมราช?",
        faq_a9: "Sandbox Hotel ตั้งอยู่ที่ 626/1 ถนนกะโรม ตำบลโพธิ์เสด็จ อำเภอเมือง จังหวัดนครศรีธรรมราช 80000 โรงแรมอยู่ใจกลางเมือง เดินทางสะดวก ใกล้ตลาด วัด และย่านเมืองเก่าของนครศรีธรรมราช",
        faq_q10: "มีสถานที่ท่องเที่ยวใดบ้างใกล้โรงแรมในนครศรีธรรมราช?",
        faq_a10: "Sandbox Hotel อยู่ใกล้สถานที่สำคัญในนครศรีธรรมราช ได้แก่ วัดพระมหาธาตุวรมหาวิหาร ซึ่งเป็นหนึ่งในวัดที่สำคัญที่สุดในภาคใต้ของไทย ถนนคนเดิน ตลาดท้องถิ่น พิพิธภัณฑสถานแห่งชาติ และร้านอาหารอาหารใต้ต้นตำรับ",
        faq_q11: "Sandbox Hotel เหมาะสำหรับการสำรวจภาคใต้ของไทยไหม?",
        faq_a11: "เหมาะมาก นครศรีธรรมราชเป็นศูนย์กลางของภาคใต้ที่มีเส้นทางคมนาคมสะดวก เชื่อมต่อจังหวัดใกล้เคียง ชายหาด และแหล่งวัฒนธรรม Sandbox Hotel เป็นที่พักที่เหมาะสำหรับทั้งการพักสั้นในเมืองและการเดินทางสำรวจภูมิภาคภาคใต้ของไทย",
        book_tip: "ทิป: หากมาถึงดึก โปรดระบุเวลาโดยประมาณในหมายเหตุ เพื่อให้เราช่วยเหลือได้เร็วขึ้น",
        book_guarantee: "รับประกันราคาดีที่สุดเมื่อจองตรง — ไม่มีค่าธรรมเนียม ไม่บวกราคา",
        book_benefit_1: "ตอบกลับโดยตรงจากทีมโรงแรม",
        book_benefit_2: "ราคาจองตรงของวันนั้นแบบไม่มีค่าธรรมเนียมแพลตฟอร์ม",
        book_benefit_3: "ช่วยเหลือเรื่องวันเข้าพักและคำขอก่อนตัดสินใจได้ยืดหยุ่น",

        amen_title: "สิ่งอำนวยความสะดวกสำหรับผู้เข้าพัก",
        amen_sub: "สิ่งจำเป็นที่ออกแบบมาเพื่อการเข้าพักที่สบายและสะดวกยิ่งขึ้น",
        amen_wifi_title: "Wi‑Fi",
        amen_wifi_desc: "อินเทอร์เน็ตความเร็วดีและเสถียรสำหรับทำงาน ดูสตรีม และใช้งานประจำวัน",
        amen_parking_title: "ที่จอดรถ",
        amen_parking_desc: "มีที่จอดรถในที่พักสำหรับผู้เข้าพักจำนวนจำกัด",
        amen_ac_title: "เครื่องปรับอากาศ",
        amen_ac_desc: "ควบคุมอุณหภูมิให้สบายได้ตลอดทั้งปี",
        amen_laundry_title: "บริการซักรีด",
        amen_laundry_desc: "มีบริการซักรีดตามคำขอ",
        amen_coffee_title: "กาแฟ & สแน็กบาร์",
        amen_coffee_desc: "มีเครื่องดื่มและของว่างเบา ๆ ภายในที่พัก",
        amen_service_title: "บริการผู้เข้าพัก",
        amen_service_desc: "พนักงานยินดีช่วยเหลือตลอดการเข้าพักของคุณ",

        rooms_title: "ห้องพัก",
        rooms_sub: 'แตะ <span class="kw hot">จอง</span> เพื่อเลือกประเภทห้องในแบบฟอร์ม',
        rooms_btn: "เช็คห้องว่าง",
        rooms_fine: "ราคาอาจเปลี่ยนตามวันและฤดูกาล โปรดส่งวันเข้าพักเพื่อรับราคาที่แน่นอน",

        price_from: "เริ่มต้น",
        price_ask: "สอบถาม",
        price_today: "ราคาวันนี้",
        price_rates_on_request: "รับราคาวันนี้ →",
        btn_call: "โทร",
        btn_see_photos: "ดูรูป",
        sticky_note: "อยากได้คำตอบเร็ว? โทร แชต หรือเช็กห้องว่างได้ทันที",

        room_standard_twin_title: "Standard Twin (2 เตียงเดี่ยว)",
        room_standard_double_title: "Standard Double (เตียงใหญ่)",
        room_standard_twin_btn: "เช็กห้องว่าง Twin",
        room_standard_double_btn: "เช็กห้องว่าง Double",
        room_standard_twin_meta: '<span class="kw a">คุ้มสุด</span> • 2 เตียงเดี่ยว • 28 ม² • ผู้เข้าพัก 1–2',
        room_standard_double_meta: '<span class="kw a">ยอดนิยม</span> • 1 เตียงใหญ่ • 28 ม² • ผู้เข้าพัก 1–2',

        opt_standard_twin: "Standard Twin (2 เตียงเดี่ยว)",
        opt_standard_double: "Standard Double (เตียงใหญ่)",

        tag_2_twin_beds: "2 เตียงเดี่ยว",
        tag_1_double_bed: "1 เตียงใหญ่",
        tag_28_32_m: "28 ม²",
        tag_guests_1_2: "ผู้เข้าพัก 1–2",

        bullet_large_room: "ห้องกว้าง",
        bullet_desk: "โต๊ะทำงาน + เก้าอี้",
        bullet_quiet_side: "ขอฝั่งเงียบได้ (ตามคำขอ)",
        bullet_ac_hot_shower: "แอร์ + ฝักบัวน้ำอุ่น",
        bullet_comfort_double_bed: "เตียงใหญ่ นอนสบาย",
        bullet_great_for_couples: "เหมาะสำหรับคู่รัก",
        bullet_fast_wifi: "Wi-Fi เร็ว",
        room_twin_best_for: "<strong>เหมาะสำหรับ:</strong> พักคนเดียว เดินทางกับเพื่อน หรือทริปธุรกิจสั้น ๆ",
        room_double_best_for: "<strong>เหมาะสำหรับ:</strong> คู่รักหรือพักผ่อนสบาย ๆ สองคน",
        room_type_label: "ประเภทห้อง",

        gallery_title: "แกลเลอรี",
        gallery_sub: "ปัดเพื่อดูรูปของโรงแรมและพื้นที่ส่วนกลางสำหรับผู้เข้าพัก",
        gal_exterior_title: "ภายนอกโรงแรม",
        gal_exterior_desc: "ภาพรวมโรงแรม—หาง่าย เห็นชัด และเข้าพักได้สบายใจ",
        gal_entrance_title: "ทางเข้า & การมาถึง",
        gal_entrance_desc: "เข้าพักสะดวก เดินทางง่าย ทั้งกลางวันและกลางคืน",
        gal_lobby_desc: "ความประทับใจแรกที่ดี — สะอาด เป็นมิตร และต้อนรับอย่างมีประสิทธิภาพ",
        gal_evening_view_title: "บรรยากาศภายนอกยามเย็น",
        gal_evening_view_desc: "มุมหน้าโรงแรมช่วงค่ำ ให้บรรยากาศสงบและเข้าถึงสะดวก",
        gal_flower_view_title: "มุมสวนหน้าโรงแรม",
        gal_flower_view_desc: "ดอกไม้และพื้นที่สีเขียวช่วยให้ทางเข้าดูอบอุ่นน่าพัก",
        gal_staircase_title: "บันได & ภาพตกแต่ง",
        gal_staircase_desc: "รายละเอียดภายในที่เพิ่มความอบอุ่นและเอกลักษณ์ให้โรงแรม",
        gal_std_double_title: "ห้อง Standard Double",
        gal_std_double_desc: "เตียงใหญ่ ห้องกว้าง เหมาะสำหรับคู่รักหรือพักคนเดียว",
        gal_std_twin_title: "ห้อง Standard Twin",
        gal_std_twin_desc: "สองเตียงเดี่ยว เหมาะสำหรับเพื่อนร่วมทางหรือทริปทำงาน",
        gal_bathroom_desc: "อาบน้ำอุ่น พร้อมของใช้ที่จำเป็น",
        gal_double_overview_title: "ภาพรวมห้อง Double",
        gal_double_overview_desc: "แสงอุ่น เตียงใหญ่สบาย เหมาะกับการพักผ่อน",
        gal_swipe_hint: "ปัดเพื่อดูรูปเพิ่มเติม หรือใช้ปุ่มลูกศร",

        svg_lobby_and_reception: "ล็อบบี้ & เคาน์เตอร์",
        svg_clean_bathrooms: "ห้องน้ำสะอาด",

        reviews_title: "รีวิวจากผู้เข้าพัก",
        reviews_sub: "ดูทำเลและรีวิวล่าสุดบน Google Maps เพื่อความมั่นใจก่อนจอง",
        reviews_panel_title: "ดูเสียงตอบรับล่าสุดก่อนตัดสินใจจอง",
        reviews_panel_copy: "เปิด Google Maps เพื่อดูรีวิวล่าสุด รูปภาพ และรายละเอียดทำเลก่อนจอง",
        btn_view_maps: 'ดูบน Google Maps<span class="sr-only"> (เปิดในแท็บใหม่)</span>',
        review1_title: 'นักธุรกิจ <span class="stars">★★★★★</span>',
        review1_text: "เช็คอินไว Wi-Fi เสถียร ห้องใหญ่ทำงานได้สบาย คุ้มค่า",
        review2_title: 'คู่รัก <span class="stars">★★★★★</span>',
        review2_text: "สะอาด สบาย ติดต่อยืนยันง่าย พักผ่อนราบรื่น",
        review3_title: 'ครอบครัวแวะพัก <span class="stars">★★★★☆</span>',
        review3_text: "ห้องกว้าง พนักงานช่วยเหลือดี ที่จอดรถสะดวก",
        review4_title: 'พักยาว <span class="stars">★★★★★</span>',
        review4_text: "เงียบ สบาย สิ่งอำนวยความสะดวกครบ จะกลับมาพักอีก",
        review5_title: 'ทำเลดีมาก <span class="stars">★★★★★</span>',
        review5_text: "ห้องใหญ่ สะอาด ทำเลสะดวก เช็คอินง่าย พนักงานเป็นกันเอง",

        faq_title: "คำถามที่พบบ่อย",
        faq_sub: "คำตอบเร็ว ๆ ก่อนจอง",
        faq_btn: "ส่งคำถามเข้าพัก",
        faq_show_more: "ดูคำถามเพิ่มเติม",
        faq_q1: "จองให้เร็วที่สุดทำอย่างไร?",
        faq_a1: "โทรหรือ LINE แจ้งเช็คอิน เช็คเอาต์ จำนวนผู้เข้าพัก และประเภทห้องที่ต้องการ เราจะยืนยันห้องว่างและราคารวมให้",
        faq_q2: "เวลาเช็คอินและเช็คเอาต์คือกี่โมง?",
        faq_a2: "เช็คอินได้ตั้งแต่ 14:00 และเช็คเอาต์ภายใน 11:00",
        faq_q3: "ต้องใช้อะไรตอนเช็คอิน?",
        faq_a3: "ต้องใช้บัตรประชาชนหรือพาสปอร์ตเพื่อทำการลงทะเบียน",
        faq_q4: "ราคาเปลี่ยนตามวันได้ไหม?",
        faq_a4: "ได้ ราคาเปลี่ยนตามวันและฤดูกาล ส่งวันเข้าพักเพื่อขอใบเสนอราคาที่แน่นอน",
        faq_q5: "มีที่จอดรถไหม?",
        faq_a5: "มีที่จอดรถสำหรับผู้เข้าพัก (ขึ้นอยู่กับความพร้อม)",
        faq_q6: "เหมาะกับการพักผ่อนเงียบ ๆ ไหม?",
        faq_a6: "เราพยายามจัดห้องเงียบให้ และสามารถขอฝั่งเงียบได้เมื่อมีห้องว่าง",

        loc_title: "ที่ตั้ง & ติดต่อ",
        loc_sub: "เลือกช่องทางติดต่อที่เร็วที่สุดเพื่อยืนยันห้องว่าง",
        loc_address: "ที่อยู่:",
        loc_plus: "Plus Code:",
        loc_notes: "หมายเหตุ: นโยบายอาจเปลี่ยนตามฤดูกาล หากต้องการข้อมูลล่าสุด โปรดติดต่อโรงแรมโดยตรง",

        dest_title: "สำรวจพื้นที่รอบ Sandbox Hotel",
        dest_where_title: '<span class="destIcon" aria-hidden="true">📍</span> ที่ตั้งของเรา',
        dest_where_body_short: "นครศรีธรรมราชเป็นเมืองประวัติศาสตร์ใน<strong>ภาคใต้ของไทย</strong>ริมอ่าวไทย อยู่ห่างจากกรุงเทพฯ ประมาณ 780 กม. เป็นหนึ่งในเมืองที่เก่าแก่ที่สุดของประเทศ และให้บรรยากาศที่ต่างจากเมืองชายหาดฝั่งอันดามันที่คึกคัก",
        dest_why_title: '<span class="destIcon" aria-hidden="true">✨</span> ทำไมต้องมาเยือน',
        dest_why_body_short: "นครศรีธรรมราชมีเสน่ห์แบบไทยแท้ มรดกพุทธศาสนาที่โดดเด่น และบรรยากาศท้องถิ่นที่ผ่อนคลาย เป็นที่ตั้งของวัดพระมหาธาตุวรมหาวิหาร — หนึ่งในวัดสำคัญที่สุดของประเทศไทย",
        dest_attractions_title: '<span class="destIcon" aria-hidden="true">🛕</span> สถานที่ท่องเที่ยวใกล้เคียง',
        dest_howtoget_title: '<span class="destIcon" aria-hidden="true">✈️</span> การเดินทาง',

        btn_call_now: "โทรหาโรงแรม",
        btn_email: "อีเมล",
        loc_hours: "บริการทุกวัน: 06:00–22:00",

        faq_help_title: "ต้องการความช่วยเหลือ?",
        faq_help_sub: "เราตอบกลับภายใน 15 นาทีในช่วงเวลาให้บริการ",
        faq_help_call: "โทร: 088-578-3478",
        faq_help_line: "LINE: sandbox.hotel",
        faq_help_email: "booking@sandboxhotel.com",
        faq_help_hours: "ทุกวัน 06:00–22:00",

        back_to_top: "กลับขึ้นด้านบน",
        footer_lang: "ภาษา:",

        msg_title: "คำขอจอง – Sandbox Hotel",
        msg_checkin: "เช็คอิน",
        msg_checkout: "เช็คเอาต์",
        msg_guests: "ผู้เข้าพัก",
        msg_room: "ห้อง",
        msg_name: "ชื่อ",
        msg_contact: "ติดต่อ",
        msg_notes: "หมายเหตุ",
        msg_closing: "กรุณายืนยันห้องว่างและราคารวม ขอบคุณครับ/ค่ะ",
        line_opened_hint: "เปิด LINE แล้ว คัดลอก/วางข้อความ: "
      },
      en: {
        meta_title: "Hotel in Nakhon Si Thammarat | Sandbox Hotel – Direct Booking",
        meta_desc: "Sandbox Hotel — a comfortable, well-located hotel in Nakhon Si Thammarat, Southern Thailand. Spacious rooms, free Wi-Fi, parking, and friendly service. Book direct by phone or LINE for the best rate.",
        og_title: "Sandbox Hotel in Nakhon Si Thammarat | Direct Booking",
        og_desc: "Comfortable hotel in the heart of Nakhon Si Thammarat. Spacious rooms, friendly service, and easy direct booking by phone or LINE.",
        brand_location: "Nakhon Si Thammarat, Thailand",
        nav_support: "Best Rate Direct",
        nav_line_cta: "LINE",
        nav_book: "Check Availability",
        nav_call_hotel: "Call Hotel",
        nav_line_chat: "Message on LINE",
        nav_language: "Language",
        nav_rooms: "Rooms",
        nav_offers: "Offers",
        nav_amenities: "Amenities",
        nav_gallery: "Gallery",
        nav_reviews: "Reviews",
        nav_faq: "FAQ",
        nav_location: "Location",

        hero_kicker: '<span class="kw a">Direct booking</span> <span class="sep-dot">•</span> <span class="kw">Friendly service</span> <span class="sep-dot">•</span> <span class="kw hot">Book now</span>',
        hero_kicker_short: "Sandbox Hotel • Calm boutique stay",
        hero_title: "Calm, spacious stays<br>in Nakhon Si Thammarat",
        hero_sub: 'Spacious rooms • Free Wi‑Fi • Parking • Laundry • Air conditioning<br>Friendly service: call or LINE us directly',
        hero_sub_short: "A quiet boutique hotel with roomy comfort, easy direct booking, and convenient city access.",
        hero_fine: 'Check-in <b>14:00</b> • Check-out <b>11:00</b> • Valid ID required',

        cta_request: "Check Availability",
        cta_check_direct_rate: "Check Availability & Rate",
        cta_call_hotel: "Call Hotel",
        cta_call_line: "Call Now",
        cta_call_number: "Call: 088-578-3478",
        cta_email: "Email",
        cta_open_map: 'Open Map<span class="sr-only"> (opens in new tab)</span>',
        hero_view_rooms: "View Rooms →",
        hero_review_count: "· Google reviews",
        trust_rating: "4.8",
        trust_meta: "Based on Google Maps reviews",
        hero_direct_booking_benefit: "Best rate when you book direct, with fast confirmation by phone or LINE.",
        hero_contact_hint: "Book direct by phone or LINE for the fastest confirmation.",
        hero_proof_rooms: "Spacious 28 m² rooms",
        hero_proof_parking: "Parking + fast Wi‑Fi",
        hero_proof_location: "Quiet comfort with easy city access",
        trust_direct: "Best Rate Direct",
        trust_rooms: "Spacious Rooms",
        trust_quiet: "Quiet Rooms",
        trust_wifi: "Fast Wi‑Fi",
        trust_parking: "Parking On-site",
        trust_support: "Friendly Service",

        offers_title: "Why Book Sandbox",
        offers_sub: "A well-located, comfortable hotel with everything you need for a good stay.",
        offers_btn: "Check Availability",
        offer1_title: "Book Direct, Save More",
        offer1_desc: "Message your dates — get confirmed quickly via LINE or phone. No platform fees.",
        offer2_title: "Comfortable Rooms for Work or Rest",
        offer2_desc: "Spacious 28 m² rooms with desk, A/C, and hot shower. Quiet-side allocation on request.",
        offer3_title: "Reliable Wi-Fi",
        offer3_desc: "Fast internet for work, streaming, and daily use throughout your stay.",
        offer4_title: "Parking & Easy Access",
        offer4_desc: "On-site guest parking. Central location with easy access to the city.",
        offer5_title: "Helpful Local Support",
        offer5_desc: "Friendly staff available daily. Local tips and assistance throughout your stay.",
        offer6_title: "Weekly & Monthly Rates",
        offer6_desc: "Extended stay? Ask about special weekly and monthly pricing.",
        faq_cta_text: "Still have questions? We’re happy to help.",

        book_title: "Check Availability Direct with the Hotel",
        book_sub: "Share your <span class=\"kw a\">dates</span> and <span class=\"kw\">room preference</span>, then choose your preferred contact channel. We'll reply with availability, your direct rate, and the next step.",
        book_callnow: "Call Hotel",
        book_process_label: "How direct booking works",
        book_process_step_1: "Choose your stay dates and room type.",
        book_process_step_2: "Send the inquiry by LINE, WhatsApp, or email.",
        book_process_step_3: "We reply with availability, your direct rate, and next steps.",
        book_channel_hint: "Fastest response: call or LINE. Email is best for detailed requests.",

        lbl_checkin: "Check-in",
        lbl_checkout: "Check-out",
        lbl_guests: "Guests",
        lbl_room: "Room",
        lbl_name: "Name",
        lbl_contact: "Contact (phone / email)",
        lbl_notes: "Notes",
        ph_name: "Your name",
        ph_contact: "+66 … or email",
        ph_notes: "Arrival time, special requests, etc.",
        btn_send_line: "Send via LINE",
        btn_send_wa: "Send via WhatsApp",
        btn_send_email: "Send via Email",
        btn_send_line_short: "LINE",
        btn_send_wa_short: "WhatsApp",
        book_checkin_info: "Check-in: From 14:00 · Check-out: By 11:00",
        book_id_note: "Government-issued ID or passport required at check-in.",
        form_hint: "We’ll reply with availability, your direct rate, and the next step.",
        form_hint_extended: "Choose your preferred contact channel. We’ll reply with availability, your direct rate, and the next step as soon as possible.",
        form_validation_summary: "Please review the highlighted fields so we can prepare your inquiry correctly.",
        form_status_line: "LINE is ready with your inquiry. Send it there and we’ll reply with availability and your direct rate.",
        form_status_whatsapp: "WhatsApp is ready with your inquiry. Send it there and we’ll reply with availability and your direct rate.",
        form_status_email: "Your email app opened with your inquiry. Send it when ready and we’ll reply with availability and your direct rate.",
        field_hint_checkin: "Choose your arrival date.",
        field_hint_checkout: "Choose your departure date.",
        field_hint_guests: "Tell us how many guests are staying.",
        field_hint_room: "Pick the room type you want us to quote first.",
        field_hint_name: "Optional, but helpful for a personal reply.",
        field_hint_contact: "Phone or email so we can reply directly.",
        field_hint_notes: "Optional: arrival time, bed preference, or special requests.",
        validation_required_prefix: "Please add",
        validation_checkout_after_checkin: "Check-out must be after check-in.",

        quick_label: "Quick dates",
        quick_tonight: "Tonight",
        quick_tomorrow: "Tomorrow",
        quick_weekend: "Weekend",
        quick_7n: "7 nights",
        quick_clear: "Clear",
        stay_summary_placeholder: "Select dates to see a summary.",
        stay_nights: "nights",
        stay_guests: "guests",
        stay_room: "Room",
        best_rate_note: "Direct booking = fastest confirmation • Send your dates for today’s direct rate.",
        msg_nights: "Nights",
        line_opened_hint: "LINE opened.",
        line_clipboard_hint: "Message copied to clipboard.",
        line_clipboard_fail: "Tip: copy your message if needed.",
        msg_intro: "Hello, I'd like to check availability and the direct rate.",
        why_title: "Why Discerning Travelers Choose Sandbox",
        why_sub: "Thoughtful design, authentic hospitality, and the ease of direct booking.",
        why_1_t: "Generous private spaces",
        why_1_d: "Refined rooms designed for rest, work, and contemplation.",
        why_2_t: "Personalized attention",
        why_2_d: "Direct communication with our team for tailored service.",
        why_3_t: "Curated essentials",
        why_3_d: "Premium Wi‑Fi, climate control, secure parking, laundry, and attentive care.",
        btn_view_facebook: 'Facebook<span class="sr-only"> (opens in new tab)</span>',
        faq_q7: "Is smoking allowed?",
        faq_a7: "For guest comfort, please ask reception about the current smoking policy and designated areas.",
        faq_q8: "What is the cancellation policy?",
        faq_a8: "Cancellation rules can vary by date/season. Confirm your dates with the hotel for the latest policy.",
        faq_q9: "Where is Sandbox Hotel located in Nakhon Si Thammarat?",
        faq_a9: "Sandbox Hotel is located at 626/1 Karom Road, Pho Sadet, Mueang District, Nakhon Si Thammarat 80000, Thailand. The hotel is centrally situated in Nakhon Si Thammarat city, with easy access to local markets, temples, and the historic old city area.",
        faq_q10: "What attractions are near the hotel in Nakhon Si Thammarat?",
        faq_a10: "Sandbox Hotel is close to key Nakhon Si Thammarat landmarks including Wat Phra Mahathat Woramahawihan — one of Southern Thailand's most revered Buddhist temples — as well as the city's walking street markets, the Nakhon Si Thammarat National Museum, and a wide range of local restaurants serving Southern Thai cuisine.",
        faq_q11: "Is Sandbox Hotel a good base for exploring Southern Thailand?",
        faq_a11: "Yes. Nakhon Si Thammarat is a central hub in Southern Thailand with good transport links to nearby provinces, beaches, and cultural sites. Sandbox Hotel is well-placed for both short city stays and multi-day trips exploring the Southern Thailand region.",
        book_tip: "Tip: If you are arriving late, add your estimated arrival time in Notes so we can assist faster.",
        book_guarantee: "Best Rate Guaranteed when booking direct — no booking fees, no mark-up.",
        book_benefit_1: "Direct reply from the hotel team.",
        book_benefit_2: "Today’s direct rate with no platform mark-up.",
        book_benefit_3: "Flexible help before you confirm.",

        amen_title: "Guest Amenities",
        amen_sub: "Everything you need for a comfortable stay.",
        amen_wifi_title: "Free Wi‑Fi",
        amen_wifi_desc: "High-speed internet throughout the hotel.",
        amen_parking_title: "Parking",
        amen_parking_desc: "On-site parking available for guests (limited spaces).",
        amen_ac_title: "Air Conditioning",
        amen_ac_desc: "Individual air conditioning in every room.",
        amen_laundry_title: "Laundry Service",
        amen_laundry_desc: "Laundry service available on request.",
        amen_coffee_title: "Coffee & Refreshments",
        amen_coffee_desc: "Drinks and snacks available on-site.",
        amen_service_title: "Helpful Staff",
        amen_service_desc: "Our local team is happy to help with anything you need.",

        rooms_title: "Rooms",
        rooms_sub: 'Compare our room types and pick the best fit for your stay.',
        rooms_btn: "Check Availability",
        rooms_fine: "Rates may vary by date and season. Message your dates for the exact price.",

        price_from: "From",
        price_ask: "Ask",
        price_today: "today’s rate",
        price_rates_on_request: "Get today's exact rate →",
        btn_call: "Call",
        btn_see_photos: "See photos",
        sticky_note: "Need a quick answer? Call, chat, or check availability.",

        room_standard_twin_title: "Standard Twin",
        room_standard_double_title: "Standard Double",
        room_standard_twin_btn: "Check Twin Availability",
        room_standard_double_btn: "Check Double Availability",
        room_standard_twin_meta: '<span class="kw a">Good Value</span> • 2 Twin Beds • 28 m² • Guests 1–2',
        room_standard_double_meta: '<span class="kw a">Popular Choice</span> • 1 Double Bed • 28 m² • Guests 1–2',

        opt_standard_twin: "Standard Twin",
        opt_standard_double: "Standard Double",

        tag_2_twin_beds: "2 Twin Beds",
        tag_1_double_bed: "1 Double Bed",
        tag_28_32_m: "28 m²",
        tag_guests_1_2: "Guests 1–2",

        bullet_large_room: "Spacious room layout",
        bullet_desk: "Work desk with seating",
        bullet_quiet_side: "Quiet room on request",
        bullet_ac_hot_shower: "Air conditioning + hot shower",
        bullet_comfort_double_bed: "Comfortable double bed",
        bullet_great_for_couples: "Great for couples or solo travellers",
        bullet_fast_wifi: "Free high-speed Wi-Fi",
        room_twin_best_for: "<strong>Good for:</strong> Solo travellers, colleagues, or short business trips",
        room_double_best_for: "<strong>Good for:</strong> Couples or anyone wanting a comfortable double bed",
        room_type_label: "Room Type",

        gallery_title: "Gallery",
        gallery_sub: "Swipe through photos of the hotel and guest spaces.",
        gal_exterior_title: "Hotel Exterior",
        gal_exterior_desc: "Easy to find with convenient access.",
        gal_entrance_title: "Entrance & Arrival",
        gal_entrance_desc: "A welcoming arrival, day or night.",
        gal_lobby_desc: "First impression matters—clean, friendly, efficient.",
        gal_evening_view_title: "Evening Exterior",
        gal_evening_view_desc: "A calm evening view of the hotel frontage and parking area.",
        gal_flower_view_title: "Garden Approach",
        gal_flower_view_desc: "Flower-lined details that make the entrance feel welcoming.",
        gal_staircase_title: "Staircase & Mural",
        gal_staircase_desc: "Interior details that give the hotel a warm local character.",
        gal_std_double_title: "Standard Double Room",
        gal_std_double_desc: "Comfortable and spacious — a great place to rest.",
        gal_std_twin_title: "Standard Twin Room",
        gal_std_twin_desc: "Twin beds ideal for colleagues or friends.",
        gal_bathroom_desc: "Hot shower and clean amenities.",
        gal_double_overview_title: "Double Room Overview",
        gal_double_overview_desc: "Warm lighting and a comfortable double bed for a restful night.",
        gal_swipe_hint: "Swipe for more photos or use the arrows",

        svg_lobby_and_reception: "Lobby & Reception",
        svg_clean_bathrooms: "Clean Bathrooms",

        reviews_title: "Guest Reviews",
        reviews_sub: "Check location and the latest guest feedback on Google Maps before you book.",
        reviews_panel_title: "See the latest guest feedback before you book",
        reviews_panel_copy: "Check recent comments, location details, and guest photos on Google Maps for the most current view of the hotel.",
        btn_view_maps: 'View on Google Maps<span class="sr-only"> (opens in new tab)</span>',
        review1_title: 'Business Traveler <span class="stars">★★★★★</span>',
        review1_text: "Fast check-in, stable Wi-Fi, and a big room to work in. Great value.",
        review2_title: 'Couple Weekend <span class="stars">★★★★★</span>',
        review2_text: "Clean and comfortable. Easy to message for confirmation. Smooth stay.",
        review3_title: 'Family Stopover <span class="stars">★★★★☆</span>',
        review3_text: "Spacious room and helpful staff. Parking was convenient.",
        review4_title: 'Long Stay Guest <span class="stars">★★★★★</span>',
        review4_text: "Quiet, comfortable, and practical amenities. Would stay again.",
        review5_title: 'Great Location <span class="stars">★★★★★</span>',
        review5_text: "Big room, clean, and convenient location. Easy check-in and friendly staff.",

        faq_title: "FAQ",
        faq_sub: "Quick answers before you book.",
        faq_btn: "Send Inquiry",
        faq_show_more: "Show more questions",
        faq_q1: "How do I book the fastest?",
        faq_a1: "Call or message us on LINE with check-in, check-out, guests, and preferred room type. We’ll confirm availability and total price.",
        faq_q2: "What time is check-in and check-out?",
        faq_a2: "Check-in from 14:00 and check-out by 11:00.",
        faq_q3: "What do I need at check-in?",
        faq_a3: "A government-issued ID or passport is required for registration.",
        faq_q4: "Can rates change by date?",
        faq_a4: "Yes. Rates vary by date and season. Send your dates for an exact quote.",
        faq_q5: "Do you have parking?",
        faq_a5: "Yes, guest parking is available (subject to availability).",
        faq_q6: "Is the hotel suitable for quiet rest?",
        faq_a6: "We aim for quiet rooms; quiet-side allocation is available upon request when possible.",
        faq_q9: "Where is Nakhon Si Thammarat?",
        faq_a9: "Nakhon Si Thammarat is a city in Southern Thailand on the Gulf of Thailand coast, approximately 780 km south of Bangkok. It is one of Thailand's oldest cities with over 1,000 years of history. Sandbox Hotel is in the city centre at 626/1 Karom Road.",
        faq_q10: "How do I get to Nakhon Si Thammarat?",
        faq_a10: "Three options: (1) By air — Nakhon Si Thammarat Airport (NST) has daily flights from Bangkok, about 1.5 hours. (2) By train — overnight sleeper from Bangkok's Hua Lamphong / Bang Sue stations, 12–14 hours. (3) By bus — from Bangkok's Southern Bus Terminal (Sai Tai Mai), 10–12 hours.",
        faq_q11: "What are the main attractions near the hotel?",
        faq_a11: "Nearby highlights include Wat Phra Mahathat Woramahawihan (one of Southern Thailand's most revered Buddhist temples), Nakhon Si Thammarat National Museum, the Bovorn Bazaar night market, and the old city walking street. The city is also famous for Nang Talung shadow puppet theatre, traditional nielloware crafts, and authentic Southern Thai cuisine.",

        dest_title: "Explore the Area Around Sandbox Hotel",
        dest_sub: "Southern Thailand's historic Gulf Coast city — a less-travelled destination with deep roots.",
        dest_where_title: '<span class="destIcon" aria-hidden="true">📍</span> Where is Nakhon Si Thammarat?',
        dest_where_body_short: "Nakhon Si Thammarat is a historic city in <strong>Southern Thailand</strong> on the Gulf coast, 780 km south of Bangkok. One of the oldest cities in the country, it sits apart from crowded Andaman beach resorts.",
        dest_where_body: "Nakhon Si Thammarat is a city in <strong>Southern Thailand</strong>, located on the Gulf of Thailand coast approximately 780 km south of Bangkok. It is the capital of Nakhon Si Thammarat Province and one of the oldest continuously inhabited cities in the country, with a recorded history spanning more than 1,000 years. The city sits on the Gulf Coast side of the Thai-Malay Peninsula, distinct from the Andaman Sea resorts of Phuket and Krabi.",
        dest_why_title: '<span class="destIcon" aria-hidden="true">✨</span> Why Visit Nakhon Si Thammarat?',
        dest_why_body_short: "Nakhon Si Thammarat offers authentic Thai culture, impressive Buddhist heritage, and a relaxed local atmosphere. Home to Wat Phra Mahathat Woramahawihan — one of Thailand's most significant temples.",
        dest_why_body: "Unlike the crowded beach resorts of Southern Thailand, Nakhon Si Thammarat offers authentic Thai culture, impressive Buddhist heritage, and a relaxed local atmosphere. Travellers come for Wat Phra Mahathat Woramahawihan — one of the most significant temples in all of Thailand — as well as the unique local art forms of Nang Talung shadow puppetry and traditional nielloware silver crafts. The city is also a gateway for exploring the lesser-known national parks and coastlines of Nakhon Si Thammarat Province.",
        dest_attractions_title: '<span class="destIcon" aria-hidden="true">🛕</span> Key Attractions Near Sandbox Hotel',
        dest_howtoget_title: '<span class="destIcon" aria-hidden="true">✈️</span> How to Get to Nakhon Si Thammarat',
        dest_howtoget_note: "Sandbox Hotel is a short drive or taxi ride from Nakhon Si Thammarat city centre. Airport transfers can be arranged — ask us when you book.",
        dest_region_title: "Nakhon Si Thammarat in Southern Thailand",
        dest_region_body: "Southern Thailand stretches from Chumphon in the north to the Malaysian border in the south. The region splits into two coastlines: the Gulf of Thailand coast (including Koh Samui, Koh Phangan, and Nakhon Si Thammarat) and the Andaman Sea coast (Phuket, Krabi, Koh Lanta). Nakhon Si Thammarat is one of the region's most historic inland and coastal cities — larger and more culturally rich than most visitors expect. It serves as an excellent base for exploring lesser-known Gulf Coast beaches, national parks, and authentic Southern Thai food culture.",
        dest_cta_text: "Planning a trip to Nakhon Si Thammarat? Sandbox Hotel offers direct booking, spacious rooms, and a central location.",
        dest_link_city: "Hotels in Nakhon Si Thammarat →",
        dest_link_south: "Hotels in Southern Thailand →",
        loc_title: "Location & Contact",
        loc_sub: "Choose the fastest contact method to confirm availability.",
        loc_address: "Address:",
        loc_plus: "Plus Code:",
        loc_notes: "Notes: Policies may vary by season. For the latest info, contact the hotel directly.",

        btn_call_now: "Call Hotel",
        btn_email: "Email",
        loc_hours: "Daily support: 06:00–22:00",

        faq_help_title: "Need help?",
        faq_help_sub: "We typically reply within 15 minutes during support hours.",
        faq_help_call: "Call: 088-578-3478",
        faq_help_line: "LINE: sandbox.hotel",
        faq_help_email: "booking@sandboxhotel.com",
        faq_help_hours: "Daily 06:00–22:00",

        back_to_top: "Back to top",
        footer_lang: "Language:",

        msg_title: "Booking request – Sandbox Hotel",
        msg_checkin: "Check-in",
        msg_checkout: "Check-out",
        msg_guests: "Guests",
        msg_room: "Room",
        msg_name: "Name",
        msg_contact: "Contact",
        msg_notes: "Notes",
        msg_closing: "Please confirm availability and total price. Thank you.",
        line_opened_hint: "LINE opened. Paste message: "
      },
      zh: {
        meta_title: "洛坤府酒店｜Sandbox Hotel 泰南直订住宿",
        meta_desc: "Sandbox Hotel 位于泰国洛坤府市中心。宽敞安静客房（28㎡），免费Wi-Fi、停车位、快速确认。支持电话、LINE、WhatsApp预订，直订优惠无手续费。",
        og_title: "洛坤府酒店｜Sandbox Hotel 泰南直订住宿",
        og_desc: "洛坤府市中心 Sandbox Hotel — 宽敞安静客房 • 免费Wi-Fi • 停车位。支持电话/LINE/WhatsApp快速确认，直订优惠无手续费。",
        brand_location: "泰国 洛坤府（Nakhon Si Thammarat）",
        nav_support: "直订优惠",
        nav_line_cta: "LINE",
        nav_book: "查看空房",
        nav_call_hotel: "致电酒店",
        nav_line_chat: "LINE 咨询",
        nav_language: "语言",
        nav_rooms: "房型",
        nav_offers: "优惠",
        nav_amenities: "设施",
        nav_gallery: "相册",
        nav_reviews: "评价",
        nav_faq: "常见问题",
        nav_location: "位置",

        hero_kicker: '<span class="kw a">直订</span> <span class="sep-dot">•</span> <span class="kw">友好服务</span> <span class="sep-dot">•</span> <span class="kw hot">立即预订</span>',
        hero_kicker_short: "Sandbox Hotel • 洛坤府静享精品酒店",
        hero_title: "洛坤府的<br>静谧宽敞住宿",
        hero_sub: '雅致私密空间 • 高速 Wi‑Fi • 安全停车 • 洗衣服务 • 空调<br>专属服务：电话或 LINE 直接联系',
        hero_sub_short: "安静的精品酒店，客房宽敞舒适，支持直订，市内出行也很方便",
        hero_fine: '入住 <b>14:00</b> • 退房 <b>11:00</b> • 需出示有效证件 • 静谧环境',

        cta_request: "查看空房",
        cta_check_direct_rate: "查看空房与价格",
        cta_call_hotel: "致电酒店",
        cta_call_line: "立即致电",
        cta_call_number: "致电：088-578-3478",
        cta_email: "邮箱",
        cta_open_map: '打开地图<span class="sr-only">（在新标签页中打开）</span>',
        hero_view_rooms: "查看房型 →",
        hero_review_count: "· Google 评价",
        trust_rating: "4.8",
        trust_meta: "基于 Google 地图评价",
        hero_direct_booking_benefit: "直接向酒店预订，可获更优价格与更快确认",
        hero_contact_hint: "电话或 LINE 直联酒店，最快确认空房",
        hero_proof_rooms: "28㎡ 宽敞客房",
        hero_proof_parking: "停车位 + 高速 Wi‑Fi",
        hero_proof_location: "安静舒适，进出市区方便",
        trust_direct: "直订专享优惠",
        trust_rooms: "宽敞客房",
        trust_quiet: "安静好眠",
        trust_wifi: "高速 Wi‑Fi",
        trust_parking: "住客停车",
        trust_support: "贴心专属服务",

        offers_title: "为什么选择 Sandbox",
        offers_sub: "位置便利、舒适实用的酒店，满足您的住宿需求",
        offers_btn: "查询空房",
        offer1_title: '直订更省 价格无忧',
        offer1_desc: "发送日期即可快速确认 — 通过LINE或电话预订，无平台手续费。",
        offer2_title: '舒适客房 工作休息皆宜',
        offer2_desc: "28㎡宽敞客房，配书桌、空调和热水淋浴。可按需安排安静朝向。",
        offer3_title: '稳定高速 Wi-Fi',
        offer3_desc: "快速网络，适合工作、流媒体和日常使用。",
        offer4_title: '免费停车 交通便利',
        offer4_desc: "提供住客停车位，市中心位置，出行方便。",
        offer5_title: '友好本地支持',
        offer5_desc: "友好员工每日服务，提供本地推荐和全程协助。",
        offer6_title: '周租月租专属优惠',
        offer6_desc: "长住？欢迎和询周租和月租特惠价格。",
        faq_cta_text: "还有问题？我们乐意为您解答。",

        book_title: "直接向酒店查询空房",
        book_sub: '告知您的<span class="kw a">日期</span>与<span class="kw">房型需求</span>，再选择方便的联系渠道。我们会回复空房、直订价格与下一步。',
        book_callnow: "致电酒店",
        book_process_label: "直订流程",
        book_process_step_1: "选择入住日期与房型",
        book_process_step_2: "通过 LINE、WhatsApp 或邮箱发送咨询",
        book_process_step_3: "我们回复空房、直订价格与下一步",
        book_channel_hint: "想要更快回复，建议电话或 LINE；如需详细说明，邮箱更合适",

        lbl_checkin: "入住",
        lbl_checkout: "退房",
        lbl_guests: "人数",
        lbl_room: "房型",
        lbl_name: "姓名",
        lbl_contact: "联系方式（电话/邮箱）",
        lbl_notes: "备注",
        ph_name: "你的姓名",
        ph_contact: "+66… 或邮箱",
        ph_notes: "到达时间、特殊需求等",
        btn_send_line: "通过 LINE 发送",
        btn_send_wa: "通过 WhatsApp 发送",
        btn_send_email: "通过邮箱发送",
        btn_send_line_short: "LINE",
        btn_send_wa_short: "WhatsApp",
        book_checkin_info: "入住：14:00起 · 退房：11:00前",
        book_id_note: "入住时需出示护照或身份证。",
        form_hint: "我们会回复空房、直订价格与下一步。",
        form_hint_extended: "选择您方便的联系渠道。我们会尽快回复空房、直订价格与下一步。",
        form_validation_summary: "请检查高亮字段，方便我们准确准备您的咨询。",
        form_status_line: "LINE 已准备好咨询内容。发送后，我们会回复空房与直订价格。",
        form_status_whatsapp: "WhatsApp 已准备好咨询内容。发送后，我们会回复空房与直订价格。",
        form_status_email: "邮箱已打开并填好咨询内容。发送后，我们会回复空房与直订价格。",
        field_hint_checkin: "请选择入住日期。",
        field_hint_checkout: "请选择退房日期。",
        field_hint_guests: "请告诉我们入住人数。",
        field_hint_room: "请选择想先查询的房型。",
        field_hint_name: "选填，但有助于我们更自然地回复您。",
        field_hint_contact: "请填写电话或邮箱，方便我们直接回复。",
        field_hint_notes: "选填：到店时间、床型偏好或特殊需求。",
        validation_required_prefix: "请填写",
        validation_checkout_after_checkin: "退房日期必须晚于入住日期。",

        quick_label: "快捷日期",
        quick_tonight: "今晚",
        quick_tomorrow: "明天",
        quick_weekend: "周末",
        quick_7n: "7晚",
        quick_clear: "清除",
        stay_summary_placeholder: "选择日期以查看摘要。",
        stay_nights: "晚",
        stay_guests: "位",
        stay_room: "房型",
        best_rate_note: "直接预订 = 最快确认 • 发送日期即可获取今日直订价格。",
        msg_nights: "晚数",
        line_opened_hint: "已打开LINE。",
        line_clipboard_hint: "消息已复制到剪贴板。",
        line_clipboard_fail: "提示：如需粘贴，可先复制消息。",
        msg_intro: "您好，我想咨询空房和直订价格。",
        why_title: "客人选择 Sandbox 的原因",
        why_sub: "舒适客房，友好服务，直订方便。",
        why_1_t: "宽敞客房",
        why_1_d: "舒适客房，适合休息或办公。",
        why_2_t: "快速确认",
        why_2_d: "电话或LINE联系我们，快速回复。",
        why_3_t: "设施齐全",
        why_3_d: "免费Wi‑Fi、空调、停车、洗衣和热心员工。",
        btn_view_facebook: "Facebook",
        faq_q7: "可以吸烟吗？",
        faq_a7: "室内禁烟。如需吸烟，请向前台咨询指定吸烟区域。",
        faq_q8: "取消政策是什么？",
        faq_a8: "取消政策因日期和季节不同可能有所调整，请联系酒店确认您的具体情况。",
        faq_q9: "Sandbox Hotel 位于洛坤府哪里？",
        faq_a9: "Sandbox Hotel 位于泰国洛坤府（Nakhon Si Thammarat）Pho Sadet, Mueang区Karom路626/1号，邮编80000。酒店地处市区中心，交通便利，靠近当地市集、寺庙及历史老城区。",
        faq_q10: "酒店附近有哪些景点？",
        faq_a10: "Sandbox Hotel 附近有洛坤府著名的Wat Phra Mahathat Woramahawihan（泰国南部最受尊崇的佛教寺庙之一）、步行街市集、洛坤府国家博物馆及正宗南泰餐厅，是探索城市及周边地区的理想据点。",
        faq_q11: "Sandbox Hotel 适合探索泰国南部吗？",
        faq_a11: "非常适合。洛坤府是泰国南部的重要交通枢纽，可便捷前往周边省份、海滩和文化景点。Sandbox Hotel 非常适合短期城市停留或多日游览泰国南部地区。",
        book_tip: "提示：如晚到，请在备注中写预计到达时间，方便我们更快协助。",
        book_guarantee: "直订专享优惠价格保证 — 无中介费，无加价。",
        book_benefit_1: "由酒店团队直接回复。",
        book_benefit_2: "当日直订价格，无平台加价。",
        book_benefit_3: "确认前也能获得灵活协助。",

        amen_title: "住客设施",
        amen_sub: "舒适住宿所需的一切。",
        amen_wifi_title: "免费Wi‑Fi",
        amen_wifi_desc: "稳定高速网络，满足办公、娱乐与日常所需。",
        amen_parking_title: "停车位",
        amen_parking_desc: "数量有限的私人专属停车位，仅供住客使用。",
        amen_ac_title: "独立空调",
        amen_ac_desc: "独立控制空调系统，全年舒适温度。",
        amen_laundry_title: "洗衣服务",
        amen_laundry_desc: "专业洗衣服务，按需提供。",
        amen_coffee_title: "咖啡与轻食",
        amen_coffee_desc: "精选饮品与轻食，店内供应。",
        amen_service_title: "热心员工",
        amen_service_desc: "本地团队乐意为您提供帮助。",

        rooms_title: "房型",
        rooms_sub: '点击 <span class="kw hot">预订</span> 选择房型。',
        rooms_btn: "查看空房",
        rooms_fine: "房价会随日期与季节变化。发送日期可获得准确报价。",

        price_from: "起价",
        price_ask: "咨询",
        price_today: "今日房价",
        price_rates_on_request: "获取今日准确房价 →",
        btn_call: "致电",
        btn_see_photos: "查看照片",
        sticky_note: "想快速得到回复？可直接致电、聊天或查看空房。",

        room_standard_twin_title: "标准双床房",
        room_standard_double_title: "标准大床房",
        room_standard_twin_btn: "查看双床房空房",
        room_standard_double_btn: "查看大床房空房",
        room_standard_twin_meta: '<span class="kw a">实惠之选</span> • 2 张单人床 • 28 ㎡ • 1–2 人',
        room_standard_double_meta: '<span class="kw a">热门之选</span> • 1 张大床 • 28 ㎡ • 1–2 人',

        opt_standard_twin: "标准双床房",
        opt_standard_double: "标准大床房",

        tag_2_twin_beds: "2 张单人床",
        tag_1_double_bed: "1 张大床",
        tag_28_32_m: "28 ㎡",
        tag_guests_1_2: "1–2 人",

        bullet_large_room: "宽敞房间布局",
        bullet_desk: "专属办公区与座椅",
        bullet_quiet_side: "可按需安排静谧朝向",
        bullet_ac_hot_shower: "独立空调 + 雨淋花洒",
        bullet_comfort_double_bed: "舒适大床",
        bullet_great_for_couples: "适合情侣或独自旅客",
        bullet_fast_wifi: "高速优质 Wi-Fi",
        room_twin_best_for: "<strong>适合：</strong>独自出行、同事结伴或短期商务住宿",
        room_double_best_for: "<strong>适合：</strong>情侣或想要舒适大床的旅客",
        room_type_label: "房型",

        gallery_title: "相册",
        gallery_sub: "浏览酒店与住客公共空间的照片。",
        gal_exterior_title: "酒店外观",
        gal_exterior_desc: "交通便利，容易找到。",
        gal_entrance_title: "入口与到店",
        gal_entrance_desc: "友好迎宾，日夜皆宜。",
        gal_lobby_desc: "第一印象很重要——整洁、友好、高效。",
        gal_evening_view_title: "夜间酒店外观",
        gal_evening_view_desc: "傍晚时分的酒店门前与停车区域，氛围安静从容。",
        gal_flower_view_title: "花园迎宾一角",
        gal_flower_view_desc: "花卉与绿植点缀入口，让到店体验更温馨。",
        gal_staircase_title: "楼梯与壁画",
        gal_staircase_desc: "富有本地气质的室内细节，为酒店增添温暖个性。",
        gal_std_double_title: "标准大床房",
        gal_std_double_desc: "舒适宽敞，适合休息。",
        gal_std_twin_title: "标准双床房",
        gal_std_twin_desc: "双床配置，适合同事或朋友同行。",
        gal_bathroom_desc: "雨淋花洒与高品质备品。",
        gal_double_overview_title: "大床房概览",
        gal_double_overview_desc: "温馨灯光搭配舒适大床，带来安稳好眠。",
        gal_swipe_hint: "左右滑动查看更多照片，或使用箭头按钮",

        svg_lobby_and_reception: "大堂与前台",
        svg_clean_bathrooms: "干净浴室",

        reviews_title: "住客评价",
        reviews_sub: "查看 Google Maps 上的位置与真实评价，预订更放心。",
        reviews_panel_title: "预订前先看看最新住客反馈",
        reviews_panel_copy: "打开 Google Maps 查看最新评论、位置细节与住客照片，再决定是否预订。",
        btn_view_maps: '在Google Maps查看<span class="sr-only">（在新标签页中打开）</span>',
        review1_title: '商务出行 <span class="stars">★★★★★</span>',
        review1_text: "办理入住很快，Wi-Fi稳定，房间大，办公方便，性价比高。",
        review2_title: '周末出行 <span class="stars">★★★★★</span>',
        review2_text: "干净舒适，沟通确认很方便，入住顺畅。",
        review3_title: '家庭短住 <span class="stars">★★★★☆</span>',
        review3_text: "房间宽敞，员工热心，停车也方便。",
        review4_title: '长住客人 <span class="stars">★★★★★</span>',
        review4_text: "安静实用，配套齐全，下次还会入住。",
        review5_title: '位置很方便 <span class="stars">★★★★★</span>',
        review5_text: "房间大且干净，位置便利，入住简单，员工友善。",

        faq_title: "常见问题",
        faq_sub: "预订前的快速解答。",
        faq_btn: "发送入住咨询",
        faq_show_more: "查看更多问题",
        faq_q1: "怎样预订最快？",
        faq_a1: "通过电话或LINE告知入住/退房日期、人数和房型，我们会确认空房与总价。",
        faq_q2: "入住和退房时间？",
        faq_a2: "入住 14:00 起，退房 11:00 前。",
        faq_q3: "入住需要什么证件？",
        faq_a3: "登记需护照或政府签发身份证件。",
        faq_q4: "房价会随日期变化吗？",
        faq_a4: "会。房价随日期与季节变化。发送日期可获得准确报价。",
        faq_q5: "有停车位吗？",
        faq_a5: "有，住客可使用店内停车位（数量有限，先到先得）。",
        faq_q6: "适合安静休息吗？",
        faq_a6: "适合。我们尽量安排安静房间，也可按需安排安静一侧。",
        faq_q9: "洛坤府在哪里？",
        faq_a9: "洛坤府（Nakhon Si Thammarat）是泰国南部的一座城市，位于泰国湾沿岸，距曼谷约780公里。它是泰国最古老的城市之一，有超过1000年的历史。Sandbox Hotel 位于市中心 626/1 Karom 路。",
        faq_q10: "如何前往洛坤府？",
        faq_a10: "三种方式：(1) 飞机 — 洛坤府机场（NST）每日有来自曼谷（廊曼/素万那普）的航班，约1.5小时。(2) 火车 — 从曼谷华兰蓬/邦苏夕站乘夜卧火车，约12–14小时。(3) 大巴 — 从曼谷南部汽车站出发，约10–12小时。",
        faq_q11: "酒店附近有哪些景点？",
        faq_a11: "附近亮点包括：帕玛哈塔沃拉玛哈维汉寺（泰国南部最重要的佛教寺庙之一）、洛坤府国家博物馆、博问夜市，以及老城步行街。洛坤府也是纳泰隆皮影戏和传统银器工艺的故乡。",

        dest_title: "探索 Sandbox Hotel 周边",
        dest_sub: "泰国湾沿岸的千年古城，体验地道南泰文化",
        dest_where_title: '<span class="destIcon" aria-hidden="true">📍</span> 洛坤府在哪里？',
        dest_where_body_short: "洛坤府是位于<strong>泰国南部</strong>泰国湾沿岸的历史名城，距离曼谷约 780 公里。它是泰国最古老的城市之一，氛围与拥挤的安达曼海海滨度假区截然不同。",
        dest_where_body: "洛坤府是泰国南部的一座城市，位于泰国湾沿岸，距曼谷约780公里。它是洛坤府府的首府，也是泰国有记录历史超过1000年的最古老城市之一。",
        dest_why_title: '<span class="destIcon" aria-hidden="true">✨</span> 为何值得前往洛坤府？',
        dest_why_body_short: "洛坤府拥有真实的泰式文化、深厚的佛教遗产和轻松的本地氛围。这里坐落着瓦拍玛哈泰寺——泰国最重要的寺庙之一。",
        dest_why_body: "不同于泰南热门海滩度假区，洛坤府拥有地道的泰国文化、千年佛教遗产和轻松的本地生活气息。来这里可以参观帕玛哈塔寺、欣赏纳泰隆皮影戏，还能体验传统银器工艺。",
        dest_attractions_title: '<span class="destIcon" aria-hidden="true">🛕</span> Sandbox Hotel 附近主要景点',
        dest_howtoget_title: '<span class="destIcon" aria-hidden="true">✈️</span> 如何前往洛坤府',
        dest_howtoget_note: "Sandbox Hotel 距洛坤府市中心仅需短程出租车。如需接送服务，欢迎在预订时告知。",
        dest_region_title: "洛坤府在泰国南部的位置",
        dest_region_body: "泰国南部从春蓬延伸至马来西亚边境，分为泰国湾海岸（苏梅岛、帕岸岛、洛坤府）和安达曼海海岸（普吉岛、甲米、兰塔岛）两侧。洛坤府是南部最具历史文化价值的城市之一，也是探索鲜为人知的泰国湾海滩和国家公园的绝佳基地。",
        dest_cta_text: "计划来洛坤府？Sandbox Hotel 提供直订、宽敞客房与便利的市中心位置。",
        dest_link_city: "洛坤府酒店 →",
        dest_link_south: "泰国南部酒店 →",
        loc_title: "位置与联系",
        loc_sub: "选择最方便的联系方式查询空房。",
        loc_address: "地址：",
        loc_plus: "Plus Code：",
        loc_notes: "提示：政策可能随季节调整，最新信息请直接联系酒店。",

        btn_call_now: "立即致电",
        btn_email: "邮箱",
        loc_hours: "每日服务：06:00–22:00",

        faq_help_title: "需要帮助？",
        faq_help_sub: "服务时间内通常 15 分钟内回复。",
        faq_help_call: "电话：088-578-3478",
        faq_help_line: "LINE：sandbox.hotel",
        faq_help_email: "booking@sandboxhotel.com",
        faq_help_hours: "每日 06:00–22:00",

        back_to_top: "返回顶部",
        footer_lang: "语言:",

        msg_title: "预订请求 – Sandbox Hotel",
        msg_checkin: "入住",
        msg_checkout: "退房",
        msg_guests: "人数",
        msg_room: "房型",
        msg_name: "姓名",
        msg_contact: "联系方式",
        msg_notes: "备注",
        msg_closing: "请确认空房与总价，谢谢！",
        line_opened_hint: "已打开 LINE。请粘贴信息："
      }
    };

    function normLang(l){
      if(!l) return I18N_DEFAULT;
      l = String(l).toLowerCase();
      if(l.startsWith("zh")) return "zh";
      if(l.startsWith("en")) return "en";
      if(l.startsWith("th")) return "th";
      return I18N_DEFAULT;
    }
    function t(key){
      const pack = I18N[CURRENT_LANG] || I18N[I18N_DEFAULT] || {};
      return pack[key] || (I18N.en && I18N.en[key]) || (I18N.th && I18N.th[key]) || "";
    }
    const FLAG_MAP = { th: "🇹🇭", en: "🇬🇧", zh: "🇨🇳" };

    function applyLang(lang){
      CURRENT_LANG = normLang(lang);
      document.documentElement.setAttribute("lang", CURRENT_LANG);

      document.querySelectorAll(".langBtn").forEach(btn=>{
        const active = btn.getAttribute("data-lang") === CURRENT_LANG;
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
      const currentFlag = document.getElementById("currentFlag");
      if(currentFlag) currentFlag.textContent = FLAG_MAP[CURRENT_LANG] || "🌐";

      document.querySelectorAll("[data-i18n]").forEach(el=>{
        const key = el.getAttribute("data-i18n");
        const val = t(key);
        if(val) el.textContent = val;
      });
      document.querySelectorAll("[data-i18n-html]").forEach(el=>{
        const key = el.getAttribute("data-i18n-html");
        const val = t(key);
        if(val) el.innerHTML = val;
      });
      document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
        const key = el.getAttribute("data-i18n-ph");
        const val = t(key);
        if(val) el.setAttribute("placeholder", val);
      });

      if(t("meta_title")) document.title = t("meta_title");
      const md = document.getElementById("metaDescription");
      if(md && t("meta_desc")) md.setAttribute("content", t("meta_desc"));
      const ogt = document.getElementById("ogTitle");
      if(ogt && t("og_title")) ogt.setAttribute("content", t("og_title"));
      const ogd = document.getElementById("ogDescription");
      if(ogd && t("og_desc")) ogd.setAttribute("content", t("og_desc"));
      const twt = document.getElementById("twitterTitle");
      if(twt && t("og_title")) twt.setAttribute("content", t("og_title"));
      const twd = document.getElementById("twitterDescription");
      if(twd && t("og_desc")) twd.setAttribute("content", t("og_desc"));
      const ogLocale = document.getElementById("ogLocale");
      if(ogLocale){
        const localeMap = {th: "th_TH", en: "en_US", zh: "zh_CN"};
        ogLocale.setAttribute("content", localeMap[CURRENT_LANG] || "th_TH");
      }
    }
    function initLang(){
      const langBtn = document.getElementById("langBtn");
      const langMenu = document.getElementById("langMenu");

      function openLangMenu(open){
        if(!langBtn || !langMenu) return;
        const shouldOpen = (typeof open === "boolean") ? open : langMenu.hasAttribute("hidden");
        if(shouldOpen){
          langMenu.removeAttribute("hidden");
          langBtn.setAttribute("aria-expanded", "true");
        } else {
          langMenu.setAttribute("hidden", "");
          langBtn.setAttribute("aria-expanded", "false");
        }
      }

      try{
        const params = new URLSearchParams(window.location.search);
        const requested = params.get("lang");
        if(requested){
          applyLang(requested);
        } else {
          const stored = localStorage.getItem("sbx_lang");
          if(stored){
            applyLang(stored);
          } else {
            applyLang(I18N_DEFAULT);
          }
        }
      } catch(_e){
        applyLang("th");
      }

      if(langBtn && langMenu){
        langBtn.addEventListener("click", (e)=>{
          e.stopPropagation();
          openLangMenu(langMenu.hasAttribute("hidden"));
        });
      }

      document.querySelectorAll(".langBtn").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const lang = btn.getAttribute("data-lang");
          const previousLang = CURRENT_LANG;
          try{ localStorage.setItem("sbx_lang", lang); } catch(_e){}
          applyLang(lang);
          try{
            if(lang && lang !== previousLang){
              window.SandboxAnalytics?.trackEvent("language_switch", {
                event_category: "navigation",
                event_label: `${previousLang || "unknown"}->${lang}`,
                previous_language: previousLang || "",
                selected_language: lang,
                cta_location: "language_switcher"
              });
            }
          }catch(_e){}
          try{
            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.set("lang", lang);
            window.history.replaceState({}, "", nextUrl.toString());
          }catch(_e){}
          openLangMenu(false);
        });
      });

      document.addEventListener("click", ()=> openLangMenu(false));
      document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") openLangMenu(false); });
    }

    // ---------- Booking message / contact ----------
    function getFormData(){
      const f = document.getElementById("bookingForm");
      return {
        checkin: f.checkin.value || "",
        checkout: f.checkout.value || "",
        guests: f.guests.value || "2",
        room: f.room.value || "",
        name: f.name.value || "",
        contact: f.contact.value || "",
        notes: f.notes.value || ""
      };
    }
    function setFormStatus(message, tone){
      const hint = document.getElementById("formHint");
      if(!hint) return;
      hint.textContent = message || (t("form_hint_extended") || "");
      hint.dataset.state = tone || "info";
    }
    function getBookingFields(form){
      if(!form || !form.elements) return [];
      return Array.from(form.elements).filter((field)=> field && field.matches && field.matches("input, select, textarea"));
    }
    function getFieldLabel(field){
      return field?.closest(".field")?.querySelector("label")?.textContent?.trim() || field?.name || "this field";
    }
    function applyDateConstraint(form){
      if(!form) return;
      const checkin = form.checkin;
      const checkout = form.checkout;
      const toDate = (value)=>{
        const [y,m,d] = String(value || "").split("-").map(Number);
        if(!y || !m || !d) return null;
        return new Date(y, m - 1, d);
      };
      if(checkout){
        checkout.setCustomValidity("");
      }
      const checkinDate = checkin ? toDate(checkin.value) : null;
      const checkoutDate = checkout ? toDate(checkout.value) : null;
      if(checkinDate && checkoutDate && checkoutDate <= checkinDate){
        checkout.setCustomValidity(t("validation_checkout_after_checkin") || "Check-out must be after check-in.");
      }
    }
    function getFieldValidationMessage(field){
      if(!field) return "";
      if(field.validity?.valueMissing){
        return `${t("validation_required_prefix") || "Please add"} ${getFieldLabel(field).toLowerCase()}.`;
      }
      return field.validationMessage || "";
    }
    function updateFieldState(field){
      if(!field?.closest) return true;
      const wrapper = field.closest(".field");
      if(!wrapper) return true;
      const error = wrapper.querySelector(".fieldError");
      const hasValue = String(field.value || "").trim() !== "";
      const touched = wrapper.classList.contains("is-touched");
      const message = touched ? getFieldValidationMessage(field) : "";
      wrapper.classList.toggle("is-invalid", Boolean(message));
      wrapper.classList.toggle("is-valid", Boolean(hasValue) && !message);
      field.setAttribute("aria-invalid", message ? "true" : "false");
      if(error) error.textContent = message;
      return !message;
    }
    function validateBookingForm(form){
      if(!form) return false;
      applyDateConstraint(form);
      let firstInvalid = null;
      let valid = true;
      getBookingFields(form).forEach((field)=>{
        field.closest(".field")?.classList.add("is-touched");
        const fieldValid = updateFieldState(field);
        if(!fieldValid && !firstInvalid){
          firstInvalid = field;
        }
        if(!fieldValid){
          valid = false;
        }
      });
      if(!valid){
        setFormStatus(t("form_validation_summary") || "Please review the highlighted fields so we can prepare your inquiry correctly.", "error");
        firstInvalid?.focus();
        return false;
      }
      setFormStatus(t("form_hint") || "We’ll reply with availability, your direct rate, and the next step.", "info");
      return true;
    }
    function buildMessage(d){
      const details = [
        d.checkin ? `${t("msg_checkin") || "Check-in"}: ${d.checkin}` : null,
        d.checkout ? `${t("msg_checkout") || "Check-out"}: ${d.checkout}` : null,
        (d.checkin && d.checkout && calcNights(d.checkin, d.checkout)) ? `${t("msg_nights") || "Nights"}: ${calcNights(d.checkin, d.checkout)}` : null,
        d.guests ? `${t("msg_guests") || "Guests"}: ${d.guests}` : null,
        d.room ? `${t("msg_room") || "Room"}: ${d.room}` : null,
        d.name ? `${t("msg_name") || "Name"}: ${d.name}` : null,
        d.contact ? `${t("msg_contact") || "Contact"}: ${d.contact}` : null,
        d.notes ? `${t("msg_notes") || "Notes"}: ${d.notes}` : null
      ].filter(Boolean);
      const lines = [
        t("msg_title") || "Booking request – Sandbox Hotel",
        "",
        t("msg_intro") || "Hello, I'd like to check availability and the direct rate.",
        ...details,
        "",
        t("msg_closing") || "Please confirm availability and total price. Thank you."
      ].filter(Boolean);
      return lines.join("\n");
    }
        function calcNights(checkin, checkout){
      try{
        const toDate = (v)=>{
          const [y,m,d]=String(v||"").split("-").map(Number);
          if(!y||!m||!d) return null;
          return new Date(y, m-1, d);
        };
        const a = toDate(checkin);
        const b = toDate(checkout);
        if(!a || !b) return null;
        const ms = b.getTime() - a.getTime();
        const n = Math.round(ms / 86400000);
        return (n > 0) ? n : 1;
      }catch(_e){ return null; }
    }

    function lineMessageUrl(msg){
      const share = "https://line.me/R/msg/text/?";
      // Best-case: Official Account prefilled message link:
      //   https://line.me/R/oaMessage/@YOUR_LINE_ID/?<encoded text>
      if(/line\.me\/R\/oaMessage\//i.test(LINE_LINK)){
        let base = String(LINE_LINK || "");
        // If LINE ID is not configured (placeholder), fall back to share-text.
        if(/YOUR_LINE_ID/i.test(base)){
          return share + encodeURIComponent(msg);
        }
        // Remove any existing query payload, then force the "/?" suffix.
        if(base.includes("?")) base = base.split("?")[0];
        if(!base.endsWith("/")) base += "/";
        base += "?";
        return base + encodeURIComponent(msg);
      }
      // Direct Line URL (e.g., add-friend or profile link)
      if(/line\.me\//i.test(LINE_LINK)) return LINE_LINK;
      // Universal fallback: share-text (user selects the chat)
      return share + encodeURIComponent(msg);
    }

    

    async function copyToClipboard(text){
      try{
        if(navigator.clipboard && navigator.clipboard.writeText){
          await navigator.clipboard.writeText(text);
          return true;
        }
      }catch(_e){}
      return false;
    }

    async function persistBookingLead(data){
      try{
        await fetch("/api/booking-ingest", {
          method:"POST",
          headers:{"content-type":"application/json"},
          body: JSON.stringify({ ...data, source: "website" })
        });
      }catch(_e){}
    }

    function trackBookingSend(channel, data, contextElement){
      try{
        window.SandboxAnalytics?.trackBookingSuccess(channel, {
          room_type: data.room || "",
          guests: data.guests || "",
          checkin: data.checkin || "",
          checkout: data.checkout || ""
        }, contextElement || document.getElementById("bookingForm"));
      }catch(_e){}
    }
    function openWhatsApp(msg, data, contextElement){
      const url = `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(msg)}`;
      trackBookingSend("whatsapp", data || getFormData(), contextElement);
      setFormStatus(t("form_status_whatsapp") || "WhatsApp is ready with your inquiry. Send it there and we’ll reply with availability and your direct rate.", "success");
      window.open(url, "_blank", "noopener");
    }
    async function openLine(msg, data, contextElement){
      const url = lineMessageUrl(msg);
      const copied = await copyToClipboard(msg);
      trackBookingSend("line", data || getFormData(), contextElement);
      window.open(url, "_blank", "noopener");

      const clip = copied ? (t("line_clipboard_hint") || "Message copied to clipboard.") : (t("line_clipboard_fail") || "Tip: copy your message if needed.");
      setFormStatus(`${t("form_status_line") || "LINE is ready with your inquiry. Send it there and we’ll reply with availability and your direct rate."} ${clip}`.trim(), "success");
    }
    function openEmail(msg, data, contextElement){
      const subject = t("msg_title") || "Booking request – Sandbox Hotel";
      trackBookingSend("email", data || getFormData(), contextElement);
      setFormStatus(t("form_status_email") || "Your email app opened with your inquiry. Send it when ready and we’ll reply with availability and your direct rate.", "success");
      window.location.href = `mailto:${encodeURIComponent(EMAIL_TO)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    }
    function initBookingFormState(form){
      if(!form) return;
      form.setAttribute("novalidate", "novalidate");
      setFormStatus(t("form_hint_extended") || "Choose your preferred contact channel. We’ll reply with availability, your direct rate, and the next step as soon as possible.", "info");
      form.addEventListener("invalid", (event)=>{
        const field = event.target;
        if(field?.closest){
          field.closest(".field")?.classList.add("is-touched");
          applyDateConstraint(form);
          updateFieldState(field);
          setFormStatus(t("form_validation_summary") || "Please review the highlighted fields so we can prepare your inquiry correctly.", "error");
        }
      }, true);
      getBookingFields(form).forEach((field)=>{
        const sync = ()=>{
          applyDateConstraint(form);
          updateFieldState(field);
          if(field.closest(".field")?.classList.contains("is-invalid")){
            setFormStatus(t("form_validation_summary") || "Please review the highlighted fields so we can prepare your inquiry correctly.", "error");
          } else if(!form.querySelector(".field.is-invalid")){
            setFormStatus(t("form_hint") || "We’ll reply with availability, your direct rate, and the next step.", "info");
          }
        };
        field.addEventListener("blur", ()=>{
          field.closest(".field")?.classList.add("is-touched");
          sync();
        });
        field.addEventListener("input", sync);
        field.addEventListener("change", sync);
      });
    }

    function wireContactButtons(){
      // Non-JS fallbacks: real links
      ["contactLine", "bookingLineQuick", "stickyLine"].forEach(id=>{
        const el = document.getElementById(id);
        if(!el) return;
        el.setAttribute("href", lineMessageUrl(t("msg_title") || "Booking request – Sandbox Hotel"));
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        el.addEventListener("click",(e)=>{
          e.preventDefault();
          const data = getFormData();
          openLine(buildMessage(data), data, el);
        });
      });

      const form = document.getElementById("bookingForm");
      initBookingFormState(form);
      form?.addEventListener("submit", async (e)=>{
        e.preventDefault();
        if(!validateBookingForm(form)) return;
        const data = getFormData();
        await persistBookingLead(data);
        openLine(buildMessage(data), data, form);
      });
      document.getElementById("sendWhatsApp")?.addEventListener("click", async ()=>{
        if(!validateBookingForm(form)) return;
        const data = getFormData();
        await persistBookingLead(data);
        openWhatsApp(buildMessage(data), data, document.getElementById("sendWhatsApp"));
      });
      document.getElementById("sendEmail")?.addEventListener("click", async ()=>{
        if(!validateBookingForm(form)) return;
        const data = getFormData();
        await persistBookingLead(data);
        openEmail(buildMessage(data), data, document.getElementById("sendEmail"));
      });

      document.querySelectorAll("[data-room]").forEach(el=>{
        el.addEventListener("click", ()=>{
          const room = el.getAttribute("data-room");
          const select = document.getElementById("room");
          if(select) select.value = room;
        });
      });
    }

    // ---------- Room thumbnail mini-gallery ----------
    function initRoomThumbs(){
      document.querySelectorAll(".roomThumbs").forEach(strip=>{
        const heroId = strip.getAttribute("data-hero");
        const heroImg = document.getElementById(heroId);
        if(!heroImg) return;
        const heroPicture = heroImg.closest("picture");
        const heroSource = heroPicture?.querySelector("source[type='image/webp']");
        const thumbs = Array.from(strip.querySelectorAll(".roomThumb"));

        thumbs.forEach((btn, i)=>{
          btn.addEventListener("click", ()=>{
            const full = btn.getAttribute("data-full");
            const srcset = btn.getAttribute("data-srcset");
            const webp = btn.getAttribute("data-webp");
            if(full) heroImg.src = full;
            if(srcset) heroImg.srcset = srcset;
            if(webp && heroSource) heroSource.srcset = webp;
            thumbs.forEach((t, ti)=> t.setAttribute("aria-current", ti === i ? "true" : "false"));
          });
        });
      });
    }

    function initFAQ(){
      const grid = document.getElementById("faqGrid");
      const moreWrap = document.getElementById("faqMoreWrap");
      const moreBtn = document.getElementById("faqMoreBtn");
      const items = Array.from(grid?.querySelectorAll("[data-faq-item]") || []);
      if(!grid || !moreWrap || !moreBtn || !items.length) return;

      let visibleCount = 0;
      let resizeT;
      const mobileFaqQuery = window.matchMedia("(max-width: 760px)");
      const MOBILE_FAQ_BATCH = 5;
      const DESKTOP_FAQ_BATCH = 6;
      const batchSize = () => mobileFaqQuery.matches ? MOBILE_FAQ_BATCH : DESKTOP_FAQ_BATCH;

      function render(reset = false){
        const batch = batchSize();
        visibleCount = reset ? batch : Math.max(visibleCount, batch);
        items.forEach((item, index) => {
          item.hidden = index >= visibleCount;
        });
        moreWrap.hidden = visibleCount >= items.length;
      }

      moreBtn.addEventListener("click", () => {
        const previousVisibleCount = visibleCount;
        visibleCount = Math.min(items.length, visibleCount + batchSize());
        render();
        const firstNewItem = items[previousVisibleCount];
        firstNewItem?.querySelector("summary")?.focus();
      });

      items.forEach((item) => {
        item.addEventListener("toggle", () => {
          if(!item.open || !mobileFaqQuery.matches) return;
          items.forEach((otherItem) => {
            if(otherItem !== item) otherItem.open = false;
          });
        });
      });

      window.addEventListener("resize", ()=>{
        clearTimeout(resizeT);
        resizeT = setTimeout(() => render(), 120);
      }, { passive:true });

      render(true);
    }

    // ---------- Dates ----------
    function initDates(){
      const ci = document.getElementById("checkin");
      const co = document.getElementById("checkout");
      const guests = document.getElementById("guests");
      const room = document.getElementById("room");
      const stayEl = document.getElementById("staySummary");
      if(!ci || !co) return;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const nxt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);

      const toISO = d => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString().slice(0,10);

      // Sensible mins (prevents accidental past dates)
      ci.min = toISO(today);
      co.min = toISO(tmr);

      if(!ci.value) ci.value = toISO(tmr);
      if(!co.value) co.value = toISO(nxt);

      function toDate(v){
        const [y,m,d]=String(v||"").split("-").map(Number);
        if(!y||!m||!d) return null;
        return new Date(y, m-1, d);
      }

      function ensureValidRange(){
        const a = toDate(ci.value);
        const b = toDate(co.value);
        if(!a || !b) return;

        // Always keep checkout after checkin
        if(b <= a){
          const n = new Date(a.getFullYear(), a.getMonth(), a.getDate()+1);
          co.value = toISO(n);
        }

        // Update mins so the native picker behaves
        ci.min = toISO(today);
        const a2 = toDate(ci.value) || tmr;
        const minCo = new Date(a2.getFullYear(), a2.getMonth(), a2.getDate()+1);
        co.min = toISO(minCo);
      }

      function updateStaySummary(){
        if(!stayEl) return;
        ensureValidRange();

        const nights = calcNights(ci.value, co.value);
        const g = guests ? guests.value : "";
        const r = room ? room.value : "";

        const parts = [];
        if(nights){
          const nLabel = t("stay_nights") || "nights";
          parts.push(`<span class="stayPill">${nights} ${nLabel}</span>`);
        }
        if(g){
          const gLabel = t("stay_guests") || "guests";
          parts.push(`<span class="stayPill">${g} ${gLabel}</span>`);
        }
        if(r){
          const rLabel = t("stay_room") || "Room";
          parts.push(`<span class="stayPill">${rLabel}: ${r}</span>`);
        }

        if(parts.length){
          stayEl.removeAttribute("data-i18n");
          stayEl.innerHTML = parts.join("");
        }else{
          stayEl.setAttribute("data-i18n", "stay_summary_placeholder");
          stayEl.textContent = t("stay_summary_placeholder") || "Select dates to see a summary.";
        }
      }

      ci.addEventListener("change", updateStaySummary, {passive:true});
      co.addEventListener("change", updateStaySummary, {passive:true});
      if(guests) guests.addEventListener("change", updateStaySummary, {passive:true});
      if(room) room.addEventListener("change", updateStaySummary, {passive:true});

      // Quick date presets
      document.querySelectorAll(".quickBtn").forEach(btn=>{
        btn.addEventListener("click", ()=>{
          const mode = btn.getAttribute("data-qd");

          const addDays = (d, n)=> new Date(d.getFullYear(), d.getMonth(), d.getDate()+n);

          const nextDow = (start, dow)=>{
            const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const delta = (dow - s.getDay() + 7) % 7;
            return addDays(s, delta === 0 ? 7 : delta); // next occurrence
          };

          if(mode === "clear"){
            ci.value = "";
            co.value = "";
            updateStaySummary();
            return;
          }
          if(mode === "tonight"){
            const a = today;
            const b = addDays(today, 1);
            ci.value = toISO(a); co.value = toISO(b);
          }else if(mode === "tomorrow"){
            const a = addDays(today, 1);
            const b = addDays(today, 2);
            ci.value = toISO(a); co.value = toISO(b);
          }else if(mode === "weekend"){
            // Next Friday → Sunday (2 nights)
            const fri = nextDow(today, 5);
            const sun = addDays(fri, 2);
            ci.value = toISO(fri); co.value = toISO(sun);
          }else if(mode === "7n"){
            const a = toDate(ci.value) || today;
            const b = addDays(a, 7);
            ci.value = toISO(a); co.value = toISO(b);
          }

          updateStaySummary();
          try{
            if(document.documentElement.getAttribute("data-compact") === "true"){
              document.getElementById("bookingForm")?.scrollIntoView({behavior:"smooth", block:"start"});
            }
          }catch(_e){}
        }, {passive:true});
      });

      updateStaySummary();
    }

    // ---------- Nav menu (mobile dropdown) ----------
    function initNavMenu(){
      const navGroup = document.querySelector(".navGroup");
      if(!navGroup) return;

      const isPhone = ()=> document.documentElement.getAttribute("data-device") === "phone";

      function closeNav(){
        navGroup.removeAttribute("open");
        document.body.classList.remove("nav-open");
      }

      // Lock/unlock body scroll on phone when panel opens or closes
      navGroup.addEventListener("toggle", ()=>{
        if(navGroup.open && isPhone()){
          document.body.classList.add("nav-open");
        } else {
          document.body.classList.remove("nav-open");
        }
      });

      // Close panel when any link inside it is clicked
      navGroup.querySelector(".navPanel")?.querySelectorAll("a[href]").forEach(link=>{
        link.addEventListener("click", ()=>{ closeNav(); });
      });

      // Close panel on outside click / tap
      document.addEventListener("click", (e)=>{
        if(navGroup.open && !navGroup.contains(e.target)){
          closeNav();
        }
      });

      // Close panel on Escape key
      document.addEventListener("keydown", (e)=>{
        if(e.key === "Escape" && navGroup.open){
          closeNav();
          navGroup.querySelector("summary")?.focus();
        }
      });
    }

    // ---------- Boot ----------
    (function boot(){
      document.getElementById("y").textContent = new Date().getFullYear();
      initTheme();
      initLang();
      initNavMenu();
      initFAQ();
      initDates();
      wireContactButtons();
      window.SandboxHotelHome?.initGalleryCarousel?.();
      initRoomThumbs();
      window.SandboxHotelHome?.initHeaderScroll?.();
    })();
