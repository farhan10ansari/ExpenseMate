import { getLocales } from "expo-localization";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

type CurrencyToLocaleMap = Record<CurrencyCode, LocaleValue>;
export const currencyToLocaleMap: CurrencyToLocaleMap = {
    AED: "ar-AE",     // UAE Dirham - United Arab Emirates Arabic
    AFN: "fa-AF",     // Afghan Afghani - Afghanistan Persian
    ALL: "sq-AL",     // Albanian Lek - Albania Albanian
    AMD: "hy-AM",     // Armenian Dram - Armenia Armenian
    ANG: "nl-CW",     // Netherlands Antillean Guilder - Curaçao Dutch
    AOA: "pt-AO",     // Angolan Kwanza - Angola Portuguese
    ARS: "es-AR",     // Argentine Peso - Argentina Spanish
    AUD: "en-AU",     // Australian Dollar - Australia English
    AWG: "nl-AW",     // Aruban Florin - Aruba Dutch
    AZN: "az-AZ",     // Azerbaijani Manat - Azerbaijan Azerbaijani
    BAM: "bs-BA",     // Bosnia and Herzegovina Convertible Mark - Bosnia Bosnian
    BBD: "en-BB",     // Barbadian Dollar - Barbados English
    BDT: "bn-BD",     // Bangladeshi Taka - Bangladesh Bengali
    BGN: "bg-BG",     // Bulgarian Lev - Bulgaria Bulgarian
    BHD: "ar-BH",     // Bahraini Dinar - Bahrain Arabic
    BIF: "fr-BI",     // Burundian Franc - Burundi French
    BMD: "en-BM",     // Bermudian Dollar - Bermuda English
    BND: "ms-BN",     // Brunei Dollar - Brunei Malay
    BOB: "es-BO",     // Bolivian Boliviano - Bolivia Spanish
    BRL: "pt-BR",     // Brazilian Real - Brazil Portuguese
    BSD: "en-BS",     // Bahamian Dollar - Bahamas English
    BTN: "dz-BT",     // Bhutanese Ngultrum - Bhutan Dzongkha
    BWP: "en-BW",     // Botswana Pula - Botswana English
    BYN: "be-BY",     // Belarusian Ruble - Belarus Belarusian
    BZD: "en-BZ",     // Belize Dollar - Belize English
    CAD: "en-CA",     // Canadian Dollar - Canada English
    CHF: "de-CH",     // Swiss Franc - Switzerland German/French
    CLP: "es-CL",     // Chilean Peso - Chile Spanish
    CNY: "zh-CN",     // Chinese Yuan - China Chinese (Mandarin)
    COP: "es-CO",     // Colombian Peso - Colombia Spanish
    CRC: "es-CR",     // Costa Rican Colón - Costa Rica Spanish
    CUP: "es-CU",     // Cuban Peso - Cuba Spanish
    CZK: "cs-CZ",     // Czech Koruna - Czech Republic Czech
    DKK: "da-DK",     // Danish Krone - Denmark Danish
    DOP: "es-DO",     // Dominican Peso - Dominican Republic Spanish
    EGP: "ar-EG",     // Egyptian Pound - Egypt Arabic
    ERN: "ti-ER",     // Eritrean Nakfa - Eritrea Tigrinya
    ETB: "am-ET",     // Ethiopian Birr - Ethiopia Amharic
    EUR: "de-DE",     // Euro - Germany German (default Eurozone)
    FJD: "en-FJ",     // Fijian Dollar - Fiji English
    FKP: "en-FK",     // Falkland Islands Pound - Falkland Islands English
    GBP: "en-GB",     // British Pound Sterling - UK English
    GEL: "ka-GE",     // Georgian Lari - Georgia Georgian
    GHS: "en-GH",     // Ghanaian Cedi - Ghana English
    GIP: "en-GI",     // Gibraltar Pound - Gibraltar English
    GMD: "en-GM",     // Gambian Dalasi - Gambia English
    GNF: "fr-GN",     // Guinean Franc - Guinea French
    GTQ: "es-GT",     // Guatemalan Quetzal - Guatemala Spanish
    GYD: "en-GY",     // Guyanese Dollar - Guyana English
    HKD: "zh-HK",     // Hong Kong Dollar - Hong Kong Chinese
    HNL: "es-HN",     // Honduran Lempira - Honduras Spanish
    HRK: "hr-HR",     // Croatian Kuna - Croatia Croatian
    HTG: "fr-HT",     // Haitian Gourde - Haiti French
    HUF: "hu-HU",     // Hungarian Forint - Hungary Hungarian
    IDR: "id-ID",     // Indonesian Rupiah - Indonesia Indonesian
    // ILS: "he-IL",     // Israeli New Shekel - Israel Hebrew
    INR: "en-IN",     // Indian Rupee - India Hindi (or en-IN for English)
    ISK: "is-IS",     // Icelandic Króna - Iceland Icelandic
    JMD: "en-JM",     // Jamaican Dollar - Jamaica English
    JPY: "ja-JP",     // Japanese Yen - Japan Japanese
    KES: "en-KE",     // Kenyan Shilling - Kenya English
    KHR: "km-KH",     // Cambodian Riel - Cambodia Khmer
    KRW: "ko-KR",     // South Korean Won - South Korea Korean
    KWD: "ar-KW",     // Kuwaiti Dinar - Kuwait Arabic
    KYD: "en-KY",     // Cayman Islands Dollar - Cayman Islands English
    KZT: "kk-KZ",     // Kazakhstani Tenge - Kazakhstan Kazakh
    LAK: "lo-LA",     // Lao Kip - Laos Lao
    LKR: "si-LK",     // Sri Lankan Rupee - Sri Lanka Sinhala
    LRD: "en-LR",     // Liberian Dollar - Liberia English
    LSL: "en-LS",     // Lesotho Loti - Lesotho English
    MAD: "ar-MA",     // Moroccan Dirham - Morocco Arabic
    MDL: "ro-MD",     // Moldovan Leu - Moldova Romanian
    MGA: "mg-MG",     // Malagasy Ariary - Madagascar Malagasy
    MKD: "mk-MK",     // Macedonian Denar - North Macedonia Macedonian
    MMK: "my-MM",     // Myanmar Kyat - Myanmar Burmese
    MNT: "mn-MN",     // Mongolian Tugrik - Mongolia Mongolian
    MOP: "zh-MO",     // Macanese Pataca - Macau Chinese
    MRU: "ar-MR",     // Mauritanian Ouguiya - Mauritania Arabic
    MUR: "en-MU",     // Mauritian Rupee - Mauritius English
    MVR: "dv-MV",     // Maldivian Rufiyaa - Maldives Divehi
    MWK: "en-MW",     // Malawian Kwacha - Malawi English
    MXN: "es-MX",     // Mexican Peso - Mexico Spanish
    MYR: "ms-MY",     // Malaysian Ringgit - Malaysia Malay
    MZN: "pt-MZ",     // Mozambican Metical - Mozambique Portuguese
    NAD: "en-NA",     // Namibian Dollar - Namibia English
    NGN: "en-NG",     // Nigerian Naira - Nigeria English
    NOK: "no-NO",     // Norwegian Krone - Norway Norwegian
    NPR: "ne-NP",     // Nepalese Rupee - Nepal Nepali
    NZD: "en-NZ",     // New Zealand Dollar - New Zealand English
    OMR: "ar-OM",     // Omani Rial - Oman Arabic
    PAB: "es-PA",     // Panamanian Balboa - Panama Spanish
    PEN: "es-PE",     // Peruvian Sol - Peru Spanish
    PGK: "en-PG",     // Papua New Guinean Kina - Papua New Guinea English
    PHP: "fil-PH",     // Philippine Peso - Philippines Filipino
    PKR: "ur-PK",     // Pakistani Rupee - Pakistan Urdu
    PLN: "pl-PL",     // Polish Zloty - Poland Polish
    PYG: "es-PY",     // Paraguayan Guarani - Paraguay Spanish
    QAR: "ar-QA",     // Qatari Riyal - Qatar Arabic
    RON: "ro-RO",     // Romanian Leu - Romania Romanian
    RSD: "sr-RS",     // Serbian Dinar - Serbia Serbian
    RUB: "ru-RU",     // Russian Ruble - Russia Russian
    RWF: "rw-RW",     // Rwandan Franc - Rwanda Kinyarwanda
    SAR: "ar-SA",     // Saudi Riyal - Saudi Arabia Arabic
    SCR: "en-SC",     // Seychellois Rupee - Seychelles English
    SDG: "ar-SD",     // Sudanese Pound - Sudan Arabic
    SEK: "sv-SE",     // Swedish Krona - Sweden Swedish
    SGD: "en-SG",     // Singapore Dollar - Singapore English
    SHP: "en-SH",     // Saint Helena Pound - Saint Helena English
    SLL: "en-SL",     // Sierra Leonean Leone - Sierra Leone English
    SOS: "so-SO",     // Somali Shilling - Somalia Somali
    SRD: "nl-SR",     // Surinamese Dollar - Suriname Dutch
    STN: "pt-ST",     // São Tomé and Príncipe Dobra - São Tomé Portuguese
    SYP: "ar-SY",     // Syrian Pound - Syria Arabic
    SZL: "ss-SZ",     // Swazi Lilangeni - Eswatini Swazi
    THB: "th-TH",     // Thai Baht - Thailand Thai
    TJS: "tg-TJ",     // Tajikistani Somoni - Tajikistan Tajik
    TMT: "tk-TM",     // Turkmenistani Manat - Turkmenistan Turkmen
    TND: "ar-TN",     // Tunisian Dinar - Tunisia Arabic
    TRY: "tr-TR",     // Turkish Lira - Turkey Turkish
    TTD: "en-TT",     // Trinidad and Tobago Dollar - Trinidad English
    TWD: "zh-TW",     // New Taiwan Dollar - Taiwan Chinese
    TZS: "sw-TZ",     // Tanzanian Shilling - Tanzania Swahili
    UAH: "uk-UA",     // Ukrainian Hryvnia - Ukraine Ukrainian
    UGX: "en-UG",     // Ugandan Shilling - Uganda English
    USD: "en-US",     // United States Dollar - US English
    UYU: "es-UY",     // Uruguayan Peso - Uruguay Spanish
    UZS: "uz-UZ",     // Uzbekistani Som - Uzbekistan Uzbek
    VES: "es-VE",     // Venezuelan Bolívar - Venezuela Spanish
    VND: "vi-VN",     // Vietnamese Dong - Vietnam Vietnamese
    VUV: "bi-VU",     // Vanuatu Vatu - Vanuatu Bislama
    WST: "sm-WS",     // Samoan Tala - Samoa Samoan
    XAF: "fr-CM",     // Central African CFA Franc - Cameroon French
    XCD: "en-AG",     // East Caribbean Dollar - Antigua English
    XOF: "fr-BJ",     // West African CFA Franc - Benin French
    XPF: "fr-PF",     // CFP Franc - French Polynesia French
    YER: "ar-YE",     // Yemeni Rial - Yemen Arabic
    ZAR: "en-ZA",     // South African Rand - South Africa English
    ZMW: "en-ZM",     // Zambian Kwacha - Zambia English
    ZWL: "en-ZW",     // Zimbabwean Dollar - Zimbabwe English
}

export const locales = [
    { locale: "ar-AE", name: "Arabic (United Arab Emirates)" },
    { locale: "fa-AF", name: "Persian (Afghanistan)" },
    { locale: "sq-AL", name: "Albanian (Albania)" },
    { locale: "hy-AM", name: "Armenian (Armenia)" },
    { locale: "nl-CW", name: "Dutch (Curaçao)" },
    { locale: "pt-AO", name: "Portuguese (Angola)" },
    { locale: "es-AR", name: "Spanish (Argentina)" },
    { locale: "en-AU", name: "English (Australia)" },
    { locale: "nl-AW", name: "Dutch (Aruba)" },
    { locale: "az-AZ", name: "Azerbaijani (Azerbaijan)" },
    { locale: "bs-BA", name: "Bosnian (Bosnia and Herzegovina)" },
    { locale: "en-BB", name: "English (Barbados)" },
    { locale: "bn-BD", name: "Bengali (Bangladesh)" },
    { locale: "bg-BG", name: "Bulgarian (Bulgaria)" },
    { locale: "ar-BH", name: "Arabic (Bahrain)" },
    { locale: "fr-BI", name: "French (Burundi)" },
    { locale: "en-BM", name: "English (Bermuda)" },
    { locale: "ms-BN", name: "Malay (Brunei)" },
    { locale: "es-BO", name: "Spanish (Bolivia)" },
    { locale: "pt-BR", name: "Portuguese (Brazil)" },
    { locale: "en-BS", name: "English (Bahamas)" },
    { locale: "dz-BT", name: "Dzongkha (Bhutan)" },
    { locale: "en-BW", name: "English (Botswana)" },
    { locale: "be-BY", name: "Belarusian (Belarus)" },
    { locale: "en-BZ", name: "English (Belize)" },
    { locale: "en-CA", name: "English (Canada)" },
    { locale: "fr-CM", name: "French (Cameroon)" },
    { locale: "de-CH", name: "German (Switzerland)" },
    { locale: "es-CL", name: "Spanish (Chile)" },
    { locale: "zh-CN", name: "Chinese (China)" },
    { locale: "es-CO", name: "Spanish (Colombia)" },
    { locale: "es-CR", name: "Spanish (Costa Rica)" },
    { locale: "es-CU", name: "Spanish (Cuba)" },
    { locale: "cs-CZ", name: "Czech (Czech Republic)" },
    { locale: "da-DK", name: "Danish (Denmark)" },
    { locale: "es-DO", name: "Spanish (Dominican Republic)" },
    { locale: "ar-DZ", name: "Arabic (Algeria)" },
    { locale: "ar-EG", name: "Arabic (Egypt)" },
    { locale: "ti-ER", name: "Tigrinya (Eritrea)" },
    { locale: "am-ET", name: "Amharic (Ethiopia)" },
    { locale: "de-DE", name: "German (Germany)" },
    { locale: "en-FJ", name: "English (Fiji)" },
    { locale: "en-FK", name: "English (Falkland Islands)" },
    { locale: "en-GB", name: "English (United Kingdom)" },
    { locale: "ka-GE", name: "Georgian (Georgia)" },
    { locale: "en-GH", name: "English (Ghana)" },
    { locale: "en-GI", name: "English (Gibraltar)" },
    { locale: "en-GM", name: "English (Gambia)" },
    { locale: "fr-GN", name: "French (Guinea)" },
    { locale: "es-GT", name: "Spanish (Guatemala)" },
    { locale: "en-GY", name: "English (Guyana)" },
    { locale: "zh-HK", name: "Chinese (Hong Kong)" },
    { locale: "es-HN", name: "Spanish (Honduras)" },
    { locale: "hr-HR", name: "Croatian (Croatia)" },
    { locale: "fr-HT", name: "French (Haiti)" },
    { locale: "hu-HU", name: "Hungarian (Hungary)" },
    { locale: "id-ID", name: "Indonesian (Indonesia)" },
    // { locale: "he-IL", name: "Hebrew (Israel)" },
    { locale: "en-IN", name: "English (India)" },
    { locale: "hi-IN", name: "Hindi (India)" },
    { locale: "tr-TR", name: "Turkish (Turkey)" },
    { locale: "is-IS", name: "Icelandic (Iceland)" },
    { locale: "en-JM", name: "English (Jamaica)" },
    { locale: "ja-JP", name: "Japanese (Japan)" },
    { locale: "en-KE", name: "English (Kenya)" },
    { locale: "km-KH", name: "Khmer (Cambodia)" },
    { locale: "ko-KR", name: "Korean (South Korea)" },
    { locale: "ar-KW", name: "Arabic (Kuwait)" },
    { locale: "en-KY", name: "English (Cayman Islands)" },
    { locale: "kk-KZ", name: "Kazakh (Kazakhstan)" },
    { locale: "lo-LA", name: "Lao (Laos)" },
    { locale: "si-LK", name: "Sinhala (Sri Lanka)" },
    { locale: "en-LR", name: "English (Liberia)" },
    { locale: "en-LS", name: "English (Lesotho)" },
    { locale: "ar-MA", name: "Arabic (Morocco)" },
    { locale: "ro-MD", name: "Romanian (Moldova)" },
    { locale: "mg-MG", name: "Malagasy (Madagascar)" },
    { locale: "mk-MK", name: "Macedonian (North Macedonia)" },
    { locale: "my-MM", name: "Burmese (Myanmar)" },
    { locale: "mn-MN", name: "Mongolian (Mongolia)" },
    { locale: "zh-MO", name: "Chinese (Macau)" },
    { locale: "ar-MR", name: "Arabic (Mauritania)" },
    { locale: "en-MU", name: "English (Mauritius)" },
    { locale: "dv-MV", name: "Divehi (Maldives)" },
    { locale: "en-MW", name: "English (Malawi)" },
    { locale: "es-MX", name: "Spanish (Mexico)" },
    { locale: "ms-MY", name: "Malay (Malaysia)" },
    { locale: "pt-MZ", name: "Portuguese (Mozambique)" },
    { locale: "en-NA", name: "English (Namibia)" },
    { locale: "en-NG", name: "English (Nigeria)" },
    { locale: "no-NO", name: "Norwegian (Norway)" },
    { locale: "ne-NP", name: "Nepali (Nepal)" },
    { locale: "en-NZ", name: "English (New Zealand)" },
    { locale: "ar-OM", name: "Arabic (Oman)" },
    { locale: "es-PA", name: "Spanish (Panama)" },
    { locale: "es-PE", name: "Spanish (Peru)" },
    { locale: "en-PG", name: "English (Papua New Guinea)" },
    { locale: "fil-PH", name: "Filipino (Philippines)" },
    { locale: "ur-PK", name: "Urdu (Pakistan)" },
    { locale: "pl-PL", name: "Polish (Poland)" },
    { locale: "es-PY", name: "Spanish (Paraguay)" },
    { locale: "ar-QA", name: "Arabic (Qatar)" },
    { locale: "ro-RO", name: "Romanian (Romania)" },
    { locale: "sr-RS", name: "Serbian (Serbia)" },
    { locale: "ru-RU", name: "Russian (Russia)" },
    { locale: "rw-RW", name: "Kinyarwanda (Rwanda)" },
    { locale: "ar-SA", name: "Arabic (Saudi Arabia)" },
    { locale: "en-SC", name: "English (Seychelles)" },
    { locale: "ar-SD", name: "Arabic (Sudan)" },
    { locale: "sv-SE", name: "Swedish (Sweden)" },
    { locale: "en-SG", name: "English (Singapore)" },
    { locale: "en-SH", name: "English (Saint Helena)" },
    { locale: "en-SL", name: "English (Sierra Leone)" },
    { locale: "so-SO", name: "Somali (Somalia)" },
    { locale: "nl-SR", name: "Dutch (Suriname)" },
    { locale: "pt-ST", name: "Portuguese (São Tomé and Príncipe)" },
    { locale: "ar-SY", name: "Arabic (Syria)" },
    { locale: "ss-SZ", name: "Swazi (Eswatini)" },
    { locale: "th-TH", name: "Thai (Thailand)" },
    { locale: "tg-TJ", name: "Tajik (Tajikistan)" },
    { locale: "tk-TM", name: "Turkmen (Turkmenistan)" },
    { locale: "ar-TN", name: "Arabic (Tunisia)" },
    { locale: "en-TT", name: "English (Trinidad and Tobago)" },
    { locale: "zh-TW", name: "Chinese (Taiwan)" },
    { locale: "sw-TZ", name: "Swahili (Tanzania)" },
    { locale: "uk-UA", name: "Ukrainian (Ukraine)" },
    { locale: "en-UG", name: "English (Uganda)" },
    { locale: "en-US", name: "English (United States)" },
    { locale: "es-UY", name: "Spanish (Uruguay)" },
    { locale: "uz-UZ", name: "Uzbek (Uzbekistan)" },
    { locale: "es-VE", name: "Spanish (Venezuela)" },
    { locale: "vi-VN", name: "Vietnamese (Vietnam)" },
    { locale: "bi-VU", name: "Bislama (Vanuatu)" },
    { locale: "sm-WS", name: "Samoan (Samoa)" },
    { locale: "en-AG", name: "English (Antigua and Barbuda)" },
    { locale: "fr-BJ", name: "French (Benin)" },
    { locale: "fr-PF", name: "French (French Polynesia)" },
    { locale: "ar-YE", name: "Arabic (Yemen)" },
    { locale: "en-ZA", name: "English (South Africa)" },
    { locale: "en-ZM", name: "English (Zambia)" },
    { locale: "en-ZW", name: "English (Zimbabwe)" }
] as const;

export type LocaleValue = (typeof locales)[number]['locale'];

export type CurrencyData = {
    code: string;
    name: string;
    symbol: string;
    countries: string[];
    flags: string[];
    icon?: IconSource;
}

export const currenciesData: CurrencyData[] = [
    {
        code: 'AED',
        name: 'UAE Dirham',
        symbol: 'د.إ',
        countries: ['United Arab Emirates'],
        flags: ['🇦🇪'],
    },
    {
        code: 'AFN',
        name: 'Afghan Afghani',
        symbol: '؋',
        countries: ['Afghanistan'],
        flags: ['🇦🇫'],
    },
    {
        code: 'ALL',
        name: 'Albanian Lek',
        symbol: 'L',
        countries: ['Albania'],
        flags: ['🇦🇱'],
    },
    {
        code: 'AMD',
        name: 'Armenian Dram',
        symbol: '֏',
        countries: ['Armenia'],
        flags: ['🇦🇲'],
    },
    {
        code: 'ANG',
        name: 'Netherlands Antillean Guilder',
        symbol: 'ƒ',
        countries: ['Curaçao', 'Sint Maarten'],
        flags: ['🇨🇼', '🇸🇽'],
    },
    {
        code: 'AOA',
        name: 'Angolan Kwanza',
        symbol: 'Kz',
        countries: ['Angola'],
        flags: ['🇦🇴'],
    },
    {
        code: 'ARS',
        name: 'Argentine Peso',
        symbol: '$',
        countries: ['Argentina'],
        flags: ['🇦🇷'],
    },
    {
        code: 'AUD',
        name: 'Australian Dollar',
        symbol: 'A$',
        countries: ['Australia', 'Christmas Island', 'Cocos Islands', 'Norfolk Island', 'Nauru', 'Tuvalu', 'Kiribati'],
        flags: ['🇦🇺', '🇨🇽', '🇨🇨', '🇳🇫', '🇳🇷', '🇹🇻', '🇰🇮'],
    },
    {
        code: 'AWG',
        name: 'Aruban Florin',
        symbol: 'ƒ',
        countries: ['Aruba'],
        flags: ['🇦🇼'],
    },
    {
        code: 'AZN',
        name: 'Azerbaijani Manat',
        symbol: '₼',
        countries: ['Azerbaijan'],
        flags: ['🇦🇿'],
    },
    {
        code: 'BAM',
        name: 'Bosnia and Herzegovina Convertible Mark',
        symbol: 'KM',
        countries: ['Bosnia and Herzegovina'],
        flags: ['🇧🇦'],
    },
    {
        code: 'BBD',
        name: 'Barbadian Dollar',
        symbol: 'Bds$',
        countries: ['Barbados'],
        flags: ['🇧🇧'],
    },
    {
        code: 'BDT',
        name: 'Bangladeshi Taka',
        symbol: '৳',
        countries: ['Bangladesh'],
        flags: ['🇧🇩'],
    },
    {
        code: 'BGN',
        name: 'Bulgarian Lev',
        symbol: 'лв',
        countries: ['Bulgaria'],
        flags: ['🇧🇬'],
    },
    {
        code: 'BHD',
        name: 'Bahraini Dinar',
        symbol: '.د.ب',
        countries: ['Bahrain'],
        flags: ['🇧🇭'],
    },
    {
        code: 'BIF',
        name: 'Burundian Franc',
        symbol: 'FBu',
        countries: ['Burundi'],
        flags: ['🇧🇮'],
    },
    {
        code: 'BMD',
        name: 'Bermudian Dollar',
        symbol: 'BD$',
        countries: ['Bermuda'],
        flags: ['🇧🇲'],
    },
    {
        code: 'BND',
        name: 'Brunei Dollar',
        symbol: 'B$',
        countries: ['Brunei'],
        flags: ['🇧🇳'],
    },
    {
        code: 'BOB',
        name: 'Bolivian Boliviano',
        symbol: 'Bs',
        countries: ['Bolivia'],
        flags: ['🇧🇴'],
    },
    {
        code: 'BRL',
        name: 'Brazilian Real',
        symbol: 'R$',
        countries: ['Brazil'],
        flags: ['🇧🇷'],
    },
    {
        code: 'BSD',
        name: 'Bahamian Dollar',
        symbol: 'B$',
        countries: ['Bahamas'],
        flags: ['🇧🇸'],
    },
    {
        code: 'BTN',
        name: 'Bhutanese Ngultrum',
        symbol: 'Nu.',
        countries: ['Bhutan'],
        flags: ['🇧🇹'],
    },
    {
        code: 'BWP',
        name: 'Botswana Pula',
        symbol: 'P',
        countries: ['Botswana'],
        flags: ['🇧🇼'],
    },
    {
        code: 'BYN',
        name: 'Belarusian Ruble',
        symbol: 'Br',
        countries: ['Belarus'],
        flags: ['🇧🇾'],
    },
    {
        code: 'BZD',
        name: 'Belize Dollar',
        symbol: 'BZ$',
        countries: ['Belize'],
        flags: ['🇧🇿'],
    },
    {
        code: 'CAD',
        name: 'Canadian Dollar',
        symbol: 'C$',
        countries: ['Canada'],
        flags: ['🇨🇦'],
    },
    {
        code: 'CDF',
        name: 'Congolese Franc',
        symbol: 'FC',
        countries: ['Democratic Republic of the Congo'],
        flags: ['🇨🇩'],
    },
    {
        code: 'CHF',
        name: 'Swiss Franc',
        symbol: 'CHF',
        countries: ['Switzerland', 'Liechtenstein'],
        flags: ['🇨🇭', '🇱🇮'],
    },
    {
        code: 'CLP',
        name: 'Chilean Peso',
        symbol: '$',
        countries: ['Chile'],
        flags: ['🇨🇱'],
    },
    {
        code: 'CNY',
        name: 'Chinese Yuan',
        symbol: '¥',
        countries: ['China'],
        flags: ['🇨🇳'],
    },
    {
        code: 'COP',
        name: 'Colombian Peso',
        symbol: '$',
        countries: ['Colombia'],
        flags: ['🇨🇴'],
    },
    {
        code: 'CRC',
        name: 'Costa Rican Colón',
        symbol: '₡',
        countries: ['Costa Rica'],
        flags: ['🇨🇷'],
    },
    {
        code: 'CUP',
        name: 'Cuban Peso',
        symbol: '₱',
        countries: ['Cuba'],
        flags: ['🇨🇺'],
    },
    {
        code: 'CVE',
        name: 'Cape Verdean Escudo',
        symbol: '$',
        countries: ['Cape Verde'],
        flags: ['🇨🇻'],
    },
    {
        code: 'CZK',
        name: 'Czech Koruna',
        symbol: 'Kč',
        countries: ['Czech Republic'],
        flags: ['🇨🇿'],
    },
    {
        code: 'DJF',
        name: 'Djiboutian Franc',
        symbol: 'Fdj',
        countries: ['Djibouti'],
        flags: ['🇩🇯'],
    },
    {
        code: 'DKK',
        name: 'Danish Krone',
        symbol: 'kr',
        countries: ['Denmark', 'Faroe Islands', 'Greenland'],
        flags: ['🇩🇰', '🇫🇴', '🇬🇱'],
    },
    {
        code: 'DOP',
        name: 'Dominican Peso',
        symbol: 'RD$',
        countries: ['Dominican Republic'],
        flags: ['🇩🇴'],
    },
    {
        code: 'DZD',
        name: 'Algerian Dinar',
        symbol: 'دج',
        countries: ['Algeria'],
        flags: ['🇩🇿'],
    },
    {
        code: 'EGP',
        name: 'Egyptian Pound',
        symbol: '£',
        countries: ['Egypt'],
        flags: ['🇪🇬'],
    },
    {
        code: 'ERN',
        name: 'Eritrean Nakfa',
        symbol: 'Nfk',
        countries: ['Eritrea'],
        flags: ['🇪🇷'],
    },
    {
        code: 'ETB',
        name: 'Ethiopian Birr',
        symbol: 'Br',
        countries: ['Ethiopia'],
        flags: ['🇪🇹'],
    },
    {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        countries: ['Austria', 'Belgium', 'Cyprus', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Portugal', 'Slovakia', 'Slovenia', 'Spain'],
        flags: ['🇦🇹', '🇧🇪', '🇨🇾', '🇪🇪', '🇫🇮', '🇫🇷', '🇩🇪', '🇬🇷', '🇮🇪', '🇮🇹', '🇱🇻', '🇱🇹', '🇱🇺', '🇲🇹', '🇳🇱', '🇵🇹', '🇸🇰', '🇸🇮', '🇪🇸'],
        icon: 'currency-eur',
    },
    {
        code: 'FJD',
        name: 'Fijian Dollar',
        symbol: 'FJ$',
        countries: ['Fiji'],
        flags: ['🇫🇯'],
    },
    {
        code: 'FKP',
        name: 'Falkland Islands Pound',
        symbol: '£',
        countries: ['Falkland Islands'],
        flags: ['🇫🇰'],
    },
    {
        code: 'GBP',
        name: 'British Pound Sterling',
        symbol: '£',
        countries: ['United Kingdom'],
        flags: ['🇬🇧'],
    },
    {
        code: 'GEL',
        name: 'Georgian Lari',
        symbol: '₾',
        countries: ['Georgia'],
        flags: ['🇬🇪'],
    },
    {
        code: 'GGP',
        name: 'Guernsey Pound',
        symbol: '£',
        countries: ['Guernsey'],
        flags: ['🇬🇬'],
    },
    {
        code: 'GHS',
        name: 'Ghanaian Cedi',
        symbol: '₵',
        countries: ['Ghana'],
        flags: ['🇬🇭'],
    },
    {
        code: 'GIP',
        name: 'Gibraltar Pound',
        symbol: '£',
        countries: ['Gibraltar'],
        flags: ['🇬🇮'],
    },
    {
        code: 'GMD',
        name: 'Gambian Dalasi',
        symbol: 'D',
        countries: ['Gambia'],
        flags: ['🇬🇲'],
    },
    {
        code: 'GNF',
        name: 'Guinean Franc',
        symbol: 'GNF',
        countries: ['Guinea'],
        flags: ['🇬🇳'],
    },
    {
        code: 'GTQ',
        name: 'Guatemalan Quetzal',
        symbol: 'Q',
        countries: ['Guatemala'],
        flags: ['🇬🇹'],
    },
    {
        code: 'GYD',
        name: 'Guyanese Dollar',
        symbol: 'GY$',
        countries: ['Guyana'],
        flags: ['🇬🇾'],
    },
    {
        code: 'HKD',
        name: 'Hong Kong Dollar',
        symbol: 'HK$',
        countries: ['Hong Kong'],
        flags: ['🇭🇰'],
    },
    {
        code: 'HNL',
        name: 'Honduran Lempira',
        symbol: 'L',
        countries: ['Honduras'],
        flags: ['🇭🇳'],
    },
    {
        code: 'HRK',
        name: 'Croatian Kuna',
        symbol: 'kn',
        countries: ['Croatia'],
        flags: ['🇭🇷'],
    },
    {
        code: 'HTG',
        name: 'Haitian Gourde',
        symbol: 'G',
        countries: ['Haiti'],
        flags: ['🇭🇹'],
    },
    {
        code: 'HUF',
        name: 'Hungarian Forint',
        symbol: 'Ft',
        countries: ['Hungary'],
        flags: ['🇭🇺'],
    },
    {
        code: 'IDR',
        name: 'Indonesian Rupiah',
        symbol: 'Rp',
        countries: ['Indonesia'],
        flags: ['🇮🇩'],
    },
    // {
    //     code: 'ILS',
    //     name: 'Israeli New Shekel',
    //     symbol: '₪',
    //     countries: ['Israel', 'Palestine'],
    //     flags: ['🇮🇱', '🇵🇸'],
    // },
    {
        code: 'IMP',
        name: 'Isle of Man Pound',
        symbol: '£',
        countries: ['Isle of Man'],
        flags: ['🇮🇲'],
    },
    {
        code: 'INR',
        name: 'Indian Rupee',
        symbol: '₹',
        countries: ['India'],
        flags: ['🇮🇳'],
        icon: 'currency-inr',
    },
    {
        code: 'IQD',
        name: 'Iraqi Dinar',
        symbol: 'ع.د',
        countries: ['Iraq'],
        flags: ['🇮🇶'],
    },
    {
        code: 'IRR',
        name: 'Iranian Rial',
        symbol: '﷼',
        countries: ['Iran'],
        flags: ['🇮🇷'],
    },
    {
        code: 'ISK',
        name: 'Icelandic Króna',
        symbol: 'kr',
        countries: ['Iceland'],
        flags: ['🇮🇸'],
    },
    {
        code: 'JEP',
        name: 'Jersey Pound',
        symbol: '£',
        countries: ['Jersey'],
        flags: ['🇯🇪'],
    },
    {
        code: 'JMD',
        name: 'Jamaican Dollar',
        symbol: 'J$',
        countries: ['Jamaica'],
        flags: ['🇯🇲'],
    },
    {
        code: 'JOD',
        name: 'Jordanian Dinar',
        symbol: 'JD',
        countries: ['Jordan'],
        flags: ['🇯🇴'],
    },
    {
        code: 'JPY',
        name: 'Japanese Yen',
        symbol: '¥',
        countries: ['Japan'],
        flags: ['🇯🇵'],
    },
    {
        code: 'KES',
        name: 'Kenyan Shilling',
        symbol: 'KSh',
        countries: ['Kenya'],
        flags: ['🇰🇪'],
    },
    {
        code: 'KGS',
        name: 'Kyrgyzstani Som',
        symbol: 'лв',
        countries: ['Kyrgyzstan'],
        flags: ['🇰🇬'],
    },
    {
        code: 'KHR',
        name: 'Cambodian Riel',
        symbol: '៛',
        countries: ['Cambodia'],
        flags: ['🇰🇭'],
    },
    {
        code: 'KMF',
        name: 'Comorian Franc',
        symbol: 'CF',
        countries: ['Comoros'],
        flags: ['🇰🇲'],
    },
    {
        code: 'KPW',
        name: 'North Korean Won',
        symbol: '₩',
        countries: ['North Korea'],
        flags: ['🇰🇵'],
    },
    {
        code: 'KRW',
        name: 'South Korean Won',
        symbol: '₩',
        countries: ['South Korea'],
        flags: ['🇰🇷'],
    },
    {
        code: 'KWD',
        name: 'Kuwaiti Dinar',
        symbol: 'د.ك',
        countries: ['Kuwait'],
        flags: ['🇰🇼'],
    },
    {
        code: 'KYD',
        name: 'Cayman Islands Dollar',
        symbol: 'CI$',
        countries: ['Cayman Islands'],
        flags: ['🇰🇾'],
    },
    {
        code: 'KZT',
        name: 'Kazakhstani Tenge',
        symbol: '₸',
        countries: ['Kazakhstan'],
        flags: ['🇰🇿'],
    },
    {
        code: 'LAK',
        name: 'Lao Kip',
        symbol: '₭',
        countries: ['Laos'],
        flags: ['🇱🇦'],
    },
    {
        code: 'LBP',
        name: 'Lebanese Pound',
        symbol: 'ل.ل',
        countries: ['Lebanon'],
        flags: ['🇱🇧'],
    },
    {
        code: 'LKR',
        name: 'Sri Lankan Rupee',
        symbol: '₨',
        countries: ['Sri Lanka'],
        flags: ['🇱🇰'],
    },
    {
        code: 'LRD',
        name: 'Liberian Dollar',
        symbol: 'L$',
        countries: ['Liberia'],
        flags: ['🇱🇷'],
    },
    {
        code: 'LSL',
        name: 'Lesotho Loti',
        symbol: 'L',
        countries: ['Lesotho'],
        flags: ['🇱🇸'],
    },
    {
        code: 'LYD',
        name: 'Libyan Dinar',
        symbol: 'ل.د',
        countries: ['Libya'],
        flags: ['🇱🇾'],
    },
    {
        code: 'MAD',
        name: 'Moroccan Dirham',
        symbol: 'د.م.',
        countries: ['Morocco', 'Western Sahara'],
        flags: ['🇲🇦', '🇪🇭'],
    },
    {
        code: 'MDL',
        name: 'Moldovan Leu',
        symbol: 'L',
        countries: ['Moldova'],
        flags: ['🇲🇩'],
    },
    {
        code: 'MGA',
        name: 'Malagasy Ariary',
        symbol: 'Ar',
        countries: ['Madagascar'],
        flags: ['🇲🇬'],
    },
    {
        code: 'MKD',
        name: 'Macedonian Denar',
        symbol: 'ден',
        countries: ['North Macedonia'],
        flags: ['🇲🇰'],
    },
    {
        code: 'MMK',
        name: 'Myanmar Kyat',
        symbol: 'Ks',
        countries: ['Myanmar'],
        flags: ['🇲🇲'],
    },
    {
        code: 'MNT',
        name: 'Mongolian Tugrik',
        symbol: '₮',
        countries: ['Mongolia'],
        flags: ['🇲🇳'],
    },
    {
        code: 'MOP',
        name: 'Macanese Pataca',
        symbol: 'MOP$',
        countries: ['Macau'],
        flags: ['🇲🇴'],
    },
    {
        code: 'MRU',
        name: 'Mauritanian Ouguiya',
        symbol: 'UM',
        countries: ['Mauritania'],
        flags: ['🇲🇷'],
    },
    {
        code: 'MUR',
        name: 'Mauritian Rupee',
        symbol: '₨',
        countries: ['Mauritius'],
        flags: ['🇲🇺'],
    },
    {
        code: 'MVR',
        name: 'Maldivian Rufiyaa',
        symbol: '.ރ',
        countries: ['Maldives'],
        flags: ['🇲🇻'],
    },
    {
        code: 'MWK',
        name: 'Malawian Kwacha',
        symbol: 'MK',
        countries: ['Malawi'],
        flags: ['🇲🇼'],
    },
    {
        code: 'MXN',
        name: 'Mexican Peso',
        symbol: '$',
        countries: ['Mexico'],
        flags: ['🇲🇽'],
    },
    {
        code: 'MYR',
        name: 'Malaysian Ringgit',
        symbol: 'RM',
        countries: ['Malaysia'],
        flags: ['🇲🇾'],
    },
    {
        code: 'MZN',
        name: 'Mozambican Metical',
        symbol: 'MT',
        countries: ['Mozambique'],
        flags: ['🇲🇿'],
    },
    {
        code: 'NAD',
        name: 'Namibian Dollar',
        symbol: 'N$',
        countries: ['Namibia'],
        flags: ['🇳🇦'],
    },
    {
        code: 'NGN',
        name: 'Nigerian Naira',
        symbol: '₦',
        countries: ['Nigeria'],
        flags: ['🇳🇬'],
    },
    {
        code: 'NIO',
        name: 'Nicaraguan Córdoba',
        symbol: 'C$',
        countries: ['Nicaragua'],
        flags: ['🇳🇮'],
    },
    {
        code: 'NOK',
        name: 'Norwegian Krone',
        symbol: 'kr',
        countries: ['Norway', 'Svalbard', 'Jan Mayen', 'Bouvet Island'],
        flags: ['🇳🇴', '🇸🇯', '🇸🇯', '🇧🇻'],
    },
    {
        code: 'NPR',
        name: 'Nepalese Rupee',
        symbol: '₨',
        countries: ['Nepal'],
        flags: ['🇳🇵'],
    },
    {
        code: 'NZD',
        name: 'New Zealand Dollar',
        symbol: 'NZ$',
        countries: ['New Zealand', 'Cook Islands', 'Niue', 'Pitcairn Islands', 'Tokelau'],
        flags: ['🇳🇿', '🇨🇰', '🇳🇺', '🇵🇳', '🇹🇰'],
    },
    {
        code: 'OMR',
        name: 'Omani Rial',
        symbol: '﷼',
        countries: ['Oman'],
        flags: ['🇴🇲'],
    },
    {
        code: 'PAB',
        name: 'Panamanian Balboa',
        symbol: 'B/.',
        countries: ['Panama'],
        flags: ['🇵🇦'],
    },
    {
        code: 'PEN',
        name: 'Peruvian Sol',
        symbol: 'S/',
        countries: ['Peru'],
        flags: ['🇵🇪'],
    },
    {
        code: 'PGK',
        name: 'Papua New Guinean Kina',
        symbol: 'K',
        countries: ['Papua New Guinea'],
        flags: ['🇵🇬'],
    },
    {
        code: 'PHP',
        name: 'Philippine Peso',
        symbol: '₱',
        countries: ['Philippines'],
        flags: ['🇵🇭'],
    },
    {
        code: 'PKR',
        name: 'Pakistani Rupee',
        symbol: '₨',
        countries: ['Pakistan'],
        flags: ['🇵🇰'],
    },
    {
        code: 'PLN',
        name: 'Polish Złoty',
        symbol: 'zł',
        countries: ['Poland'],
        flags: ['🇵🇱'],
    },
    {
        code: 'PYG',
        name: 'Paraguayan Guaraní',
        symbol: 'Gs',
        countries: ['Paraguay'],
        flags: ['🇵🇾'],
    },
    {
        code: 'QAR',
        name: 'Qatari Riyal',
        symbol: '﷼',
        countries: ['Qatar'],
        flags: ['🇶🇦'],
    },
    {
        code: 'RON',
        name: 'Romanian Leu',
        symbol: 'lei',
        countries: ['Romania'],
        flags: ['🇷🇴'],
    },
    {
        code: 'RSD',
        name: 'Serbian Dinar',
        symbol: 'Дин.',
        countries: ['Serbia'],
        flags: ['🇷🇸'],
    },
    {
        code: 'RUB',
        name: 'Russian Ruble',
        symbol: '₽',
        countries: ['Russia'],
        flags: ['🇷🇺'],
    },
    {
        code: 'RWF',
        name: 'Rwandan Franc',
        symbol: 'RF',
        countries: ['Rwanda'],
        flags: ['🇷🇼'],
    },
    {
        code: 'SAR',
        name: 'Saudi Riyal',
        symbol: '﷼',
        countries: ['Saudi Arabia'],
        flags: ['🇸🇦'],
    },
    {
        code: 'SBD',
        name: 'Solomon Islands Dollar',
        symbol: 'SI$',
        countries: ['Solomon Islands'],
        flags: ['🇸🇧'],
    },
    {
        code: 'SCR',
        name: 'Seychellois Rupee',
        symbol: '₨',
        countries: ['Seychelles'],
        flags: ['🇸🇨'],
    },
    {
        code: 'SDG',
        name: 'Sudanese Pound',
        symbol: 'ج.س.',
        countries: ['Sudan'],
        flags: ['🇸🇩'],
    },
    {
        code: 'SEK',
        name: 'Swedish Krona',
        symbol: 'kr',
        countries: ['Sweden'],
        flags: ['🇸🇪'],
    },
    {
        code: 'SGD',
        name: 'Singapore Dollar',
        symbol: 'S$',
        countries: ['Singapore'],
        flags: ['🇸🇬'],
    },
    {
        code: 'SHP',
        name: 'Saint Helena Pound',
        symbol: '£',
        countries: ['Saint Helena', 'Ascension', 'Tristan da Cunha'],
        flags: ['🇸🇭', '🇦🇨', '🇹🇦'],
    },
    {
        code: 'SLL',
        name: 'Sierra Leonean Leone',
        symbol: 'Le',
        countries: ['Sierra Leone'],
        flags: ['🇸🇱'],
    },
    {
        code: 'SOS',
        name: 'Somali Shilling',
        symbol: 'S',
        countries: ['Somalia'],
        flags: ['🇸🇴'],
    },
    {
        code: 'SRD',
        name: 'Surinamese Dollar',
        symbol: '$',
        countries: ['Suriname'],
        flags: ['🇸🇷'],
    },
    {
        code: 'STN',
        name: 'São Tomé and Príncipe Dobra',
        symbol: 'Db',
        countries: ['São Tomé and Príncipe'],
        flags: ['🇸🇹'],
    },
    {
        code: 'SYP',
        name: 'Syrian Pound',
        symbol: '£',
        countries: ['Syria'],
        flags: ['🇸🇾'],
    },
    {
        code: 'SZL',
        name: 'Swazi Lilangeni',
        symbol: 'E',
        countries: ['Eswatini'],
        flags: ['🇸🇿'],
    },
    {
        code: 'THB',
        name: 'Thai Baht',
        symbol: '฿',
        countries: ['Thailand'],
        flags: ['🇹🇭'],
    },
    {
        code: 'TJS',
        name: 'Tajikistani Somoni',
        symbol: 'SM',
        countries: ['Tajikistan'],
        flags: ['🇹🇯'],
    },
    {
        code: 'TMT',
        name: 'Turkmenistani Manat',
        symbol: 'T',
        countries: ['Turkmenistan'],
        flags: ['🇹🇲'],
    },
    {
        code: 'TND',
        name: 'Tunisian Dinar',
        symbol: 'د.ت',
        countries: ['Tunisia'],
        flags: ['🇹🇳'],
    },
    {
        code: 'TOP',
        name: 'Tongan Paʻanga',
        symbol: 'T$',
        countries: ['Tonga'],
        flags: ['🇹🇴'],
    },
    {
        code: 'TRY',
        name: 'Turkish Lira',
        symbol: '₺',
        countries: ['Turkey', 'Northern Cyprus'],
        flags: ['🇹🇷', '🇨🇾'],
    },
    {
        code: 'TTD',
        name: 'Trinidad and Tobago Dollar',
        symbol: 'TT$',
        countries: ['Trinidad and Tobago'],
        flags: ['🇹🇹'],
    },
    {
        code: 'TVD',
        name: 'Tuvaluan Dollar',
        symbol: 'TV$',
        countries: ['Tuvalu'],
        flags: ['🇹🇻'],
    },
    {
        code: 'TWD',
        name: 'New Taiwan Dollar',
        symbol: 'NT$',
        countries: ['Taiwan'],
        flags: ['🇹🇼'],
    },
    {
        code: 'TZS',
        name: 'Tanzanian Shilling',
        symbol: 'TSh',
        countries: ['Tanzania'],
        flags: ['🇹🇿'],
    },
    {
        code: 'UAH',
        name: 'Ukrainian Hryvnia',
        symbol: '₴',
        countries: ['Ukraine'],
        flags: ['🇺🇦'],
    },
    {
        code: 'UGX',
        name: 'Ugandan Shilling',
        symbol: 'USh',
        countries: ['Uganda'],
        flags: ['🇺🇬'],
    },
    {
        code: 'USD',
        name: 'United States Dollar',
        symbol: '$',
        countries: ['United States', 'American Samoa', 'British Indian Ocean Territory', 'Ecuador', 'El Salvador', 'Guam', 'Marshall Islands', 'Micronesia', 'Northern Mariana Islands', 'Palau', 'Panama', 'Puerto Rico', 'Timor-Leste', 'Turks and Caicos', 'US Virgin Islands', 'Zimbabwe'],
        flags: ['🇺🇸', '🇦🇸', '🇮🇴', '🇪🇨', '🇸🇻', '🇬🇺', '🇲🇭', '🇫🇲', '🇲🇵', '🇵🇼', '🇵🇦', '🇵🇷', '🇹🇱', '🇹🇨', '🇻🇮', '🇿🇼'],
        icon: 'currency-usd',
    },
    {
        code: 'UYU',
        name: 'Uruguayan Peso',
        symbol: '$U',
        countries: ['Uruguay'],
        flags: ['🇺🇾'],
    },
    {
        code: 'UZS',
        name: 'Uzbekistani Som',
        symbol: 'лв',
        countries: ['Uzbekistan'],
        flags: ['🇺🇿'],
    },
    {
        code: 'VED',
        name: 'Venezuelan Bolívar Digital',
        symbol: 'Bs.D',
        countries: ['Venezuela'],
        flags: ['🇻🇪'],
    },
    {
        code: 'VND',
        name: 'Vietnamese Dong',
        symbol: '₫',
        countries: ['Vietnam'],
        flags: ['🇻🇳'],
    },
    {
        code: 'VUV',
        name: 'Vanuatu Vatu',
        symbol: 'VT',
        countries: ['Vanuatu'],
        flags: ['🇻🇺'],
    },
    {
        code: 'WST',
        name: 'Samoan Tala',
        symbol: 'WS$',
        countries: ['Samoa'],
        flags: ['🇼🇸'],
    },
    {
        code: 'XAF',
        name: 'Central African CFA Franc',
        symbol: 'FCFA',
        countries: ['Cameroon', 'Central African Republic', 'Chad', 'Republic of the Congo', 'Equatorial Guinea', 'Gabon'],
        flags: ['🇨🇲', '🇨🇫', '🇹🇩', '🇨🇬', '🇬🇶', '🇬🇦'],
    },
    {
        code: 'XCD',
        name: 'East Caribbean Dollar',
        symbol: 'EC$',
        countries: ['Antigua and Barbuda', 'Dominica', 'Grenada', 'Montserrat', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Anguilla'],
        flags: ['🇦🇬', '🇩🇲', '🇬🇩', '🇲🇸', '🇰🇳', '🇱🇨', '🇻🇨', '🇦🇮'],
    },
    {
        code: 'XDR',
        name: 'Special Drawing Rights',
        symbol: 'SDR',
        countries: ['International Monetary Fund'],
        flags: ['🏦'],
    },
    {
        code: 'XOF',
        name: 'West African CFA Franc',
        symbol: 'CFA',
        countries: ['Benin', 'Burkina Faso', 'Côte d\'Ivoire', 'Guinea-Bissau', 'Mali', 'Niger', 'Senegal', 'Togo'],
        flags: ['🇧🇯', '🇧🇫', '🇨🇮', '🇬🇼', '🇲🇱', '🇳🇪', '🇸🇳', '🇹🇬'],
    },
    {
        code: 'XPF',
        name: 'CFP Franc',
        symbol: '₣',
        countries: ['French Polynesia', 'New Caledonia', 'Wallis and Futuna'],
        flags: ['🇵🇫', '🇳🇨', '🇼🇫'],
    },
    {
        code: 'YER',
        name: 'Yemeni Rial',
        symbol: '﷼',
        countries: ['Yemen'],
        flags: ['🇾🇪'],
    },
    {
        code: 'ZAR',
        name: 'South African Rand',
        symbol: 'R',
        countries: ['South Africa', 'Lesotho', 'Namibia', 'Eswatini'],
        flags: ['🇿🇦', '🇱🇸', '🇳🇦', '🇸🇿'],
    },
    {
        code: 'ZMW',
        name: 'Zambian Kwacha',
        symbol: 'ZK',
        countries: ['Zambia'],
        flags: ['🇿🇲'],
    },
    {
        code: 'ZWL',
        name: 'Zimbabwean Dollar',
        symbol: 'Z$',
        countries: ['Zimbabwe'],
        flags: ['🇿🇼'],
    },
] as const;


export type CurrencyCode = (typeof currenciesData)[number]['code'];

export const getCurrencyData = (code: CurrencyCode) => {
    const currency = currenciesData.find(c => c.code === code);
    if (!currency) {
        throw new Error(`Currency with code ${code} not found`);
    }
    return currency;
};

export const getCurrencyLocale = (code: CurrencyCode) => {
    // Mapping of some common currencies to their primary locales
    const currencyLocale = currencyToLocaleMap[code] ?? getLocales()[0].languageTag;
    if (!currencyLocale) {
        throw new Error(`Locale for currency ${code} not found`);
    }
    return currencyLocale;
};


export function getCurrencyInfo(code: string, locale: string) {
    try {
        // Create formatter for currency style
        const formatter = new Intl.NumberFormat(locale, {
            style: "currency",
            currency: code,
        });

        const opts = formatter.resolvedOptions();
        return {
            decimalPlaces: opts.maximumFractionDigits,
        }
    } catch (error) {
        console.error("Error in getCurrencyInfo:", error);
        return null;
    }
}
