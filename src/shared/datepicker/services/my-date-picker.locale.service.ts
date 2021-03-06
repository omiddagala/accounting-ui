import { Injectable } from "@angular/core";
import { IMyLocales, IMyOptions } from "../interfaces/index";

@Injectable()
export class LocaleService {
    private locales: IMyLocales = {
        "en": {
            dayLabels: {su: "Sun", mo: "Mon", tu: "Tue", we: "Wed", th: "Thu", fr: "Fri", sa: "Sat"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" },
            dateFormat: "mm/dd/yyyy",
            todayBtnTxt: "Today",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
         "fa": {
            dayLabels: {su: "ی", mo: "د", tu: "س", we: "چ", th: "پ", fr: "ج",sa: "ش"},
            monthLabels: { 1: "فروردین", 2: "اردیبهشت", 3: "خرداد", 4: "تیر", 5: "مرداد", 6: "شهریور", 7: "مهر", 8: "آبان", 9: "آذر", 10: "دی", 11: "بهمن", 12: "اسفند" },
            dateFormat: "yyyy/mm/dd",
            todayBtnTxt: "امروز",
            firstDayOfWeek: "sa",
            highlightDay: 6,
             direction:'rtl'
        },
        "he": {
            dayLabels: {su: "רא", mo: "שנ", tu: "של", we: "רב", th: "חמ", fr: "שי", sa: "שב"},
            monthLabels: { 1: "ינו", 2: "פבר", 3: "מרץ", 4: "אפר", 5: "מאי", 6: "יונ", 7: "יול", 8: "אוג", 9: "ספט", 10: "אוק", 11: "נוב", 12: "דצמ" },
            dateFormat: "dd/mm/yyyy",
            todayBtnTxt: "היום",
            firstDayOfWeek: "su",
             highlightDay: 6,
            direction:'ltr'
        },
        "ja": {
            dayLabels: {su: "日", mo: "月", tu: "火", we: "水", th: "木", fr: "金", sa: "土"},
            monthLabels: {1: "１月", 2: "２月", 3: "３月", 4: "４月", 5: "５月", 6: "６月", 7: "７月", 8: "８月", 9: "９月", 10: "１０月", 11: "１１月", 12: "１２月"},
            dateFormat: "yyyy.mm.dd",
            todayBtnTxt: "今日",
             highlightDay: 6,
            direction:'ltr'
        },
        "fr": {
            dayLabels: {su: "Dim", mo: "Lun", tu: "Mar", we: "Mer", th: "Jeu", fr: "Ven", sa: "Sam"},
            monthLabels: {1: "Jan", 2: "Fév", 3: "Mar", 4: "Avr", 5: "Mai", 6: "Juin", 7: "Juil", 8: "Aoû", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Déc"},
            dateFormat: "dd/mm/yyyy",
            todayBtnTxt: "Aujourd'hui",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "fr-ch": {
            dayLabels: {su: "Dim", mo: "Lun", tu: "Mar", we: "Mer", th: "Jeu", fr: "Ven", sa: "Sam"},
            monthLabels: {1: "Jan", 2: "Fév", 3: "Mar", 4: "Avr", 5: "Mai", 6: "Juin", 7: "Juil", 8: "Aoû", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Déc"},
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Aujourd'hui",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "fi": {
            dayLabels: {su: "Su", mo: "Ma", tu: "Ti", we: "Ke", th: "To", fr: "Pe", sa: "La"},
            monthLabels: {1: "Tam", 2: "Hel", 3: "Maa", 4: "Huh", 5: "Tou", 6: "Kes", 7: "Hei", 8: "Elo", 9: "Syy", 10: "Lok", 11: "Mar", 12: "Jou"},
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Tänään",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr',
        },
        "es": {
            dayLabels: {su: "Do", mo: "Lu", tu: "Ma", we: "Mi", th: "Ju", fr: "Vi", sa: "Sa"},
            monthLabels: {1: "Ene", 2: "Feb", 3: "Mar", 4: "Abr", 5: "May", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dic"},
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Hoy",
            firstDayOfWeek: "mo",
             highlightDay: 0,
        direction:'ltr'
        },
        "hu": {
            dayLabels: {su: "Vas", mo: "Hét", tu: "Kedd", we: "Sze", th: "Csü", fr: "Pén", sa: "Szo"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Már", 4: "Ápr", 5: "Máj", 6: "Jún", 7: "Júl", 8: "Aug", 9: "Szep", 10: "Okt", 11: "Nov", 12: "Dec" },
            dateFormat: "yyyy-mm-dd",
            todayBtnTxt: "Ma",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "sv": {
            dayLabels: {su: "Sön", mo: "Mån", tu: "Tis", we: "Ons", th: "Tor", fr: "Fre", sa: "Lör"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Maj", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Dec" },
            dateFormat: "yyyy-mm-dd",
            todayBtnTxt: "Idag",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "nl": {
            dayLabels: {su: "Zon", mo: "Maa", tu: "Din", we: "Woe", th: "Don", fr: "Vri", sa: "Zat"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mei", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Dec" },
            dateFormat: "dd-mm-yyyy",
            todayBtnTxt: "Vandaag",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "ru": {
            dayLabels: {su: "Вс", mo: "Пн", tu: "Вт", we: "Ср", th: "Чт", fr: "Пт", sa: "Сб"},
            monthLabels: { 1: "Янв", 2: "Фев", 3: "Март", 4: "Апр", 5: "Май", 6: "Июнь", 7: "Июль", 8: "Авг", 9: "Сент", 10: "Окт", 11: "Ноя", 12: "Дек" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Сегодня",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "uk": {
            dayLabels: {su: "Нд", mo: "Пн", tu: "Вт", we: "Ср", th: "Чт", fr: "Пт", sa: "Сб"},
            monthLabels: { 1: "Січ", 2: "Лют", 3: "Бер", 4: "Кві", 5: "Тра", 6: "Чер", 7: "Лип", 8: "Сер", 9: "Вер", 10: "Жов", 11: "Лис", 12: "Гру" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Сьогодні",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "no": {
            dayLabels: {su: "Søn", mo: "Man", tu: "Tir", we: "Ons", th: "Tor", fr: "Fre", sa: "Lør"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mai", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Des" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "I dag",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "tr": {
            dayLabels: {su: "Paz", mo: "Pzt", tu: "Sal", we: "Çar", th: "Per", fr: "Cum", sa: "Cmt"},
            monthLabels: { 1: "Oca", 2: "Şub", 3: "Mar", 4: "Nis", 5: "May", 6: "Haz", 7: "Tem", 8: "Ağu", 9: "Eyl", 10: "Eki", 11: "Kas", 12: "Ara" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Bugün",
            firstDayOfWeek: "mo",
             highlightDay: 6,
        },
        "pt-br": {
            dayLabels: {su: "Dom", mo: "Seg", tu: "Ter", we: "Qua", th: "Qui", fr: "Sex", sa: "Sab"},
            monthLabels: { 1: "Jan", 2: "Fev", 3: "Mar", 4: "Abr", 5: "Mai", 6: "Jun", 7: "Jul", 8: "Ago", 9: "Set", 10: "Out", 11: "Nov", 12: "Dez" },
            dateFormat: "dd/mm/yyyy",
            todayBtnTxt: "Hoje",
            firstDayOfWeek: "su",
             highlightDay: 6,
            direction:'ltr'
        },
        "de": {
            dayLabels: {su: "So", mo: "Mo", tu: "Di", we: "Mi", th: "Do", fr: "Fr", sa: "Sa"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mär", 4: "Apr", 5: "Mai", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Dez" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Heute",
            firstDayOfWeek: "mo",
             highlightDay: 6
        },
        "de-ch": {
            dayLabels: {su: "So", mo: "Mo", tu: "Di", we: "Mi", th: "Do", fr: "Fr", sa: "Sa"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mär", 4: "Apr", 5: "Mai", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Dez" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Heute",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "it": {
            dayLabels: { su: "Dom", mo: "Lun", tu: "Mar", we: "Mer", th: "Gio", fr: "Ven", sa: "Sab" },
            monthLabels: { 1: "Gen", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mag", 6: "Giu", 7: "Lug", 8: "Ago", 9: "Set", 10: "Ott", 11: "Nov", 12: "Dic" },
            dateFormat: "dd/mm/yyyy",
            todayBtnTxt: "Oggi",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "it-ch": {
            dayLabels: { su: "Dom", mo: "Lun", tu: "Mar", we: "Mer", th: "Gio", fr: "Ven", sa: "Sab" },
            monthLabels: { 1: "Gen", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mag", 6: "Giu", 7: "Lug", 8: "Ago", 9: "Set", 10: "Ott", 11: "Nov", 12: "Dic" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Oggi",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "pl": {
            dayLabels: { su: "Nie", mo: "Pon", tu: "Wto", we: "Śro", th: "Czw", fr: "Pią", sa: "Sob" },
            monthLabels: { 1: "Sty", 2: "Lut", 3: "Mar", 4: "Kwi", 5: "Maj", 6: "Cze", 7: "Lip", 8: "Sie", 9: "Wrz", 10: "Paź", 11: "Lis", 12: "Gru" },
            dateFormat: "yyyy-mm-dd",
            todayBtnTxt: "Dzisiaj",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "my": {
            dayLabels: {su: "တနင်္ဂနွေ", mo: "တနင်္လာ", tu: "အင်္ဂါ", we: "ဗုဒ္ဓဟူး", th: "ကြသပတေး", fr: "သောကြာ", sa: "စနေ"},
            monthLabels: { 1: "ဇန်နဝါရီ", 2: "ဖေဖော်ဝါရီ", 3: "မတ်", 4: "ဧပြီ", 5: "မေ", 6: "ဇွန်", 7: "ဇူလိုင်", 8: "ဩဂုတ်", 9: "စက်တင်ဘာ", 10: "အောက်တိုဘာ", 11: "နိုဝင်ဘာ", 12: "ဒီဇင်ဘာ" },
            dateFormat: "yyyy-mm-dd",
            todayBtnTxt: "ယနေ့",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "sk": {
            dayLabels: { su: "Ne", mo: "Po", tu: "Ut", we: "St", th: "Št", fr: "Pi", sa: "So" },
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Máj", 6: "Jún", 7: "Júl", 8: "Aug", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Dec" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Dnes",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "sl": {
            dayLabels: { su: "Ned", mo: "Pon", tu: "Tor", we: "Sre", th: "Čet", fr: "Pet", sa: "Sob" },
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Maj", 6: "Jun", 7: "Jul", 8: "Avg", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Dec" },
            dateFormat: "dd. mm. yyyy",
            todayBtnTxt: "Danes",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "zh-cn": {
            dayLabels: {su: "日", mo: "一", tu: "二", we: "三", th: "四", fr: "五", sa: "六"},
            monthLabels: { 1: "1月", 2: "2月", 3: "3月", 4: "4月", 5: "5月", 6: "6月", 7: "7月", 8: "8月", 9: "9月", 10: "10月", 11: "11月", 12: "12月" },
            dateFormat: "yyyy-mm-dd",
            todayBtnTxt: "今天",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "ro": {
            dayLabels: {su: "du", mo: "lu", tu: "ma", we: "mi", th: "jo", fr: "vi", sa: "sa"},
            monthLabels: { 1: "ian", 2: "feb", 3: "mart", 4: "apr", 5: "mai", 6: "iun", 7: "iul", 8: "aug", 9: "sept", 10: "oct", 11: "nov", 12: "dec" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Astăzi",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "ca": {
            dayLabels: {su: "dg", mo: "dl", tu: "dt", we: "dc", th: "dj", fr: "dv", sa: "ds"},
            monthLabels: {1: "Gen", 2: "Febr", 3: "Març", 4: "Abr", 5: "Maig", 6: "Juny", 7: "Jul", 8: "Ag", 9: "Set", 10: "Oct", 11: "Nov", 12: "Des"},
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Avui",
            firstDayOfWeek: "mo",
             highlightDay: 0,
            direction:'ltr'
        },
        "id": {
            dayLabels: {su: "Min", mo: "Sen", tu: "Sel", we: "Rab", th: "Kam", fr: "Jum", sa: "Sab"},
            monthLabels: {1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mei", 6: "Jun", 7: "Jul", 8: "Ags", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Des"},
            dateFormat: "dd-mm-yyyy",
            todayBtnTxt: "Hari ini",
            firstDayOfWeek: "su",
             highlightDay: 6,
            direction:'ltr'
        },
        "en-au": {
            dayLabels: {su: "Sun", mo: "Mon", tu: "Tue", we: "Wed", th: "Thu", fr: "Fri", sa: "Sat"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec" },
            dateFormat: "dd/mm/yyyy",
            todayBtnTxt: "Today",
            firstDayOfWeek: "mo",
             highlightDay: 6,
            direction:'ltr'
        },
        "am-et": {
            dayLabels: {su: "እሑድ", mo: "ሰኞ", tu: "ማክሰኞ", we: "ረቡዕ", th: "ሐሙስ", fr: "ዓርብ", sa: "ቅዳሜ"},
            monthLabels: { 1: "ጃንዩ", 2: "ፌብሩ", 3: "ማርች", 4: "ኤፕረ", 5: "ሜይ", 6: "ጁን", 7: "ጁላይ", 8: "ኦገስ", 9: "ሴፕቴ", 10: "ኦክተ", 11: "ኖቬም", 12: "ዲሴም" },
            dateFormat: "yyyy-mm-dd",
            todayBtnTxt: "ዛሬ",
            firstDayOfWeek: "mo",
             highlightDay: 6
        },
        "cs": {
            dayLabels: { su: "Ne", mo: "Po", tu: "Út", we: "St", th: "Čt", fr: "Pá", sa: "So" },
            monthLabels: { 1: "Led", 2: "Úno", 3: "Bře", 4: "Dub", 5: "Kvě", 6: "Čvn", 7: "Čvc", 8: "Srp", 9: "Zář", 10: "Říj", 11: "Lis", 12: "Pro" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Dnes",
            firstDayOfWeek: "mo",
             highlightDay: 6
        },
        "el": {
            dayLabels: { su: "Κυρ", mo: "Δευ", tu: "Τρι", we: "Τετ", th: "Πεμ", fr: "Παρ", sa: "Σαβ" },
            monthLabels: { 1: "Ιαν", 2: "Φεβ", 3: "Μαρ", 4: "Απρ", 5: "Μαι", 6: "Ιουν", 7: "Ιουλ", 8: "Αυγ", 9: "Σεπ", 10: "Οκτ", 11: "Νοε", 12: "Δεκ" },
            dateFormat: "dd/mm/yyyy",
            todayBtnTxt: "Σήμερα",
            firstDayOfWeek: "mo",
             highlightDay: 6
        },
        "kk": {
            dayLabels: { su: "Жк", mo: "Дс", tu: "Сс", we: "Ср", th: "Бс", fr: "Жм", sa: "Сб" },
            monthLabels: { 1: "Қаң", 2: "Ақп", 3: "Нау", 4: "Сәу", 5: "Мам", 6: "Мау", 7: "Шіл", 8: "Там", 9: "Қырк", 10: "Қаз", 11: "Қар", 12: "Желт" },
            dateFormat: "dd-mmm-yyyy",
            todayBtnTxt: "Бүгін",
            firstDayOfWeek: "mo",
             highlightDay: 6
        },
        "th": {
            dayLabels: { su: "อา", mo: "จ", tu: "อ", we: "พ", th: "พฤ", fr: "ศ", sa: "ส" },
            monthLabels: { 1: "ม.ค", 2: "ก.พ.", 3: "มี.ค.", 4: "เม.ย.", 5: "พ.ค.", 6: "มิ.ย.", 7: "ก.ค.", 8: "ส.ค.", 9: "ก.ย.", 10: "ต.ค.", 11: "พ.ย.", 12: "ธ.ค." },
            dateFormat: "dd-mm-yyyy",
            todayBtnTxt: "วันนี้",
            firstDayOfWeek: "su",
             highlightDay: 6
        },
        "ko-kr": {
            dayLabels: {su: "일", mo: "월", tu: "화", we: "수", th: "목", fr: "금", sa: "토"},
            monthLabels: { 1: "1월", 2: "2월", 3: "3월", 4: "4월", 5: "5월", 6: "6월", 7: "7월", 8: "8월", 9: "9월", 10: "10월", 11: "11월", 12: "12월" },
            dateFormat: "yyyy mm dd",
            todayBtnTxt: "오늘",
            firstDayOfWeek: "su",
             highlightDay: 6
        },
        "da": {
            dayLabels: {su: "Søn", mo: "Man", tu: "Tir", we: "Ons", th: "Tor", fr: "Fre", sa: "Lør"},
            monthLabels: { 1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Maj", 6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Dec" },
            dateFormat: "dd-mm-yyyy",
            todayBtnTxt: "I dag",
            firstDayOfWeek: "mo",
             highlightDay: 6
        },
        "lt": {
            dayLabels: {su: "Sk", mo: "Pr", tu: "An", we: "Tr", th: "Kt", fr: "Pn", sa: "Št"},
            monthLabels: { 1: "Saus.", 2: "Vas.", 3: "Kov.", 4: "Bal.", 5: "Geg.", 6: "Birž.", 7: "Liep.", 8: "Rugp.", 9: "Rugs.", 10: "Sapl.", 11: "Lapkr.", 12: "Gruod." },
            dateFormat: "yyyy-mm-dd",
            todayBtnTxt: "Šianien",
            firstDayOfWeek: "mo",
             highlightDay: 6
        },
        "vi": {
            dayLabels: {su: "CN", mo: "T2", tu: "T3", we: "T4", th: "T5", fr: "T6", sa: "T7"},
            monthLabels: { 1: "THG 1", 2: "THG 2", 3: "THG 3", 4: "THG 4", 5: "THG 5", 6: "THG 6", 7: "THG 7", 8: "THG 8", 9: "THG 9", 10: "THG 10", 11: "THG 11", 12: "THG 12" },
            dateFormat: "dd/mm/yyyy",
            todayBtnTxt: "Hôm nay",
            firstDayOfWeek: "mo",
             highlightDay: 0,
        },
        "bn": {
            dayLabels: {su: "রবি", mo: "সোম", tu: "মঙ্গল", we: "বুধ", th: "বৃহঃ", fr: "শুক্র", sa: "শনি"},
            monthLabels: { 1: "জানু", 2: "ফেব্রু", 3: "মার্চ", 4: "এপ্রিল", 5: "মে", 6: "জুন", 7: "জুলাই", 8: "আগস্ট", 9: "সেপ্টে", 10: "অক্টো", 11: "নভে", 12: "ডিসে" },
            dateFormat: "dd-mm-yyyy",
            todayBtnTxt: "আজ",
            firstDayOfWeek: "su",
             highlightDay: 6
        },
        "bg": {
            dayLabels: {su: "нд", mo: "пн", tu: "вт", we: "ср", th: "чт", fr: "пт", sa: "сб"},
            monthLabels: { 1: "яну.", 2: "фев.", 3: "март", 4: "апр.", 5: "май", 6: "юни", 7: "юли", 8: "авг.", 9: "сеп.", 10: "окт.", 11: "ное.", 12: "дек." },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "днес",
            firstDayOfWeek: "mo",
             highlightDay: 6
        },
        "hr": {
            dayLabels: {su: "Ne", mo: "Po", tu: "Ul", we: "Sr", th: "Če", fr: "Pe", sa: "Su"},
            monthLabels: { 1: "Sij", 2: "Vel", 3: "Ožu", 4: "Tra", 5: "Svi", 6: "Lip", 7: "Srp", 8: "Kol", 9: "Ruj", 10: "Lis", 11: "Stu", 12: "Pro" },
            dateFormat: "dd.mm.yyyy.",
            todayBtnTxt: "danas",
            firstDayOfWeek: "su",
             highlightDay: 6
        },
        "ar": {
            dayLabels: { su: "الأحد", mo: "الاثنين", tu: "الثلاثاء", we: "الاربعاء", th: "الخميس", fr: "الجمعة", sa: "السبت" },
            monthLabels: { 1: "يناير", 2: "فبراير", 3: "مارس", 4: "ابريل", 5: "مايو", 6: "يونيو", 7: "يوليو", 8: "أغسطس", 9: "سبتمبر", 10: "أكتوبر", 11: "نوفمبر", 12: "ديسمبر" },
            dateFormat: "yyyy-mm-dd",
            todayBtnTxt: "اليوم",
            firstDayOfWeek: "sa",
             highlightDay: 5
        },
        "is": {
            dayLabels: {su: "sun", mo: "mán", tu: "þri", we: "mið", th: "fim", fr: "fös", sa: "lau"},
            monthLabels: { 1: "jan", 2: "feb", 3: "mar", 4: "apr", 5: "maí", 6: "jún", 7: "júl", 8: "ágú", 9: "sep", 10: "okt", 11: "nóv", 12: "des" },
            dateFormat: "dd.mm.yyyy",
            todayBtnTxt: "Í dag",
            firstDayOfWeek: "su",
             highlightDay: 6
        }
    };

    getLocaleOptions(locale: string): IMyOptions {
        if (locale && this.locales.hasOwnProperty(locale)) {
            // User given locale
            return this.locales[locale];
        }
        // Default: en
        return this.locales["en"];
    }
}
