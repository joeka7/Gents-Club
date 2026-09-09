import { useState, useRef, useEffect } from 'react';
import { useLang } from '../context/LanguageContext';

// ─── Country list ─────────────────────────────────────────────────────────────

interface Country { code: string; name: string; dial: string; }

const flag = (code: string) =>
  [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('');

const regionNames: Record<string, Intl.DisplayNames> = {
  en: new Intl.DisplayNames(['en'],    { type: 'region' }),
  ar: new Intl.DisplayNames(['ar'],    { type: 'region' }),
  ru: new Intl.DisplayNames(['ru'],    { type: 'region' }),
  hi: new Intl.DisplayNames(['hi'],    { type: 'region' }),
  zh: new Intl.DisplayNames(['zh-CN'], { type: 'region' }),
};

function localCountryName(code: string, lang: string): string {
  try { return regionNames[lang]?.of(code) ?? code; } catch { return code; }
}

const COUNTRIES: Country[] = [
  { code: 'AF', name: 'Afghanistan',                   dial: '+93'   },
  { code: 'AL', name: 'Albania',                       dial: '+355'  },
  { code: 'DZ', name: 'Algeria',                       dial: '+213'  },
  { code: 'AD', name: 'Andorra',                       dial: '+376'  },
  { code: 'AO', name: 'Angola',                        dial: '+244'  },
  { code: 'AG', name: 'Antigua and Barbuda',           dial: '+1'    },
  { code: 'AR', name: 'Argentina',                     dial: '+54'   },
  { code: 'AM', name: 'Armenia',                       dial: '+374'  },
  { code: 'AU', name: 'Australia',                     dial: '+61'   },
  { code: 'AT', name: 'Austria',                       dial: '+43'   },
  { code: 'AZ', name: 'Azerbaijan',                    dial: '+994'  },
  { code: 'BS', name: 'Bahamas',                       dial: '+1'    },
  { code: 'BH', name: 'Bahrain',                       dial: '+973'  },
  { code: 'BD', name: 'Bangladesh',                    dial: '+880'  },
  { code: 'BB', name: 'Barbados',                      dial: '+1'    },
  { code: 'BY', name: 'Belarus',                       dial: '+375'  },
  { code: 'BE', name: 'Belgium',                       dial: '+32'   },
  { code: 'BZ', name: 'Belize',                        dial: '+501'  },
  { code: 'BJ', name: 'Benin',                         dial: '+229'  },
  { code: 'BT', name: 'Bhutan',                        dial: '+975'  },
  { code: 'BO', name: 'Bolivia',                       dial: '+591'  },
  { code: 'BA', name: 'Bosnia and Herzegovina',        dial: '+387'  },
  { code: 'BW', name: 'Botswana',                      dial: '+267'  },
  { code: 'BR', name: 'Brazil',                        dial: '+55'   },
  { code: 'BN', name: 'Brunei',                        dial: '+673'  },
  { code: 'BG', name: 'Bulgaria',                      dial: '+359'  },
  { code: 'BF', name: 'Burkina Faso',                  dial: '+226'  },
  { code: 'BI', name: 'Burundi',                       dial: '+257'  },
  { code: 'CV', name: 'Cabo Verde',                    dial: '+238'  },
  { code: 'KH', name: 'Cambodia',                      dial: '+855'  },
  { code: 'CM', name: 'Cameroon',                      dial: '+237'  },
  { code: 'CA', name: 'Canada',                        dial: '+1'    },
  { code: 'CF', name: 'Central African Republic',      dial: '+236'  },
  { code: 'TD', name: 'Chad',                          dial: '+235'  },
  { code: 'CL', name: 'Chile',                         dial: '+56'   },
  { code: 'CN', name: 'China',                         dial: '+86'   },
  { code: 'CO', name: 'Colombia',                      dial: '+57'   },
  { code: 'KM', name: 'Comoros',                       dial: '+269'  },
  { code: 'CG', name: 'Congo',                         dial: '+242'  },
  { code: 'CD', name: 'Congo (DRC)',                   dial: '+243'  },
  { code: 'CR', name: 'Costa Rica',                    dial: '+506'  },
  { code: 'HR', name: 'Croatia',                       dial: '+385'  },
  { code: 'CU', name: 'Cuba',                          dial: '+53'   },
  { code: 'CY', name: 'Cyprus',                        dial: '+357'  },
  { code: 'CZ', name: 'Czech Republic',                dial: '+420'  },
  { code: 'DK', name: 'Denmark',                       dial: '+45'   },
  { code: 'DJ', name: 'Djibouti',                      dial: '+253'  },
  { code: 'DM', name: 'Dominica',                      dial: '+1'    },
  { code: 'DO', name: 'Dominican Republic',            dial: '+1'    },
  { code: 'EC', name: 'Ecuador',                       dial: '+593'  },
  { code: 'EG', name: 'Egypt',                         dial: '+20'   },
  { code: 'SV', name: 'El Salvador',                   dial: '+503'  },
  { code: 'GQ', name: 'Equatorial Guinea',             dial: '+240'  },
  { code: 'ER', name: 'Eritrea',                       dial: '+291'  },
  { code: 'EE', name: 'Estonia',                       dial: '+372'  },
  { code: 'SZ', name: 'Eswatini',                      dial: '+268'  },
  { code: 'ET', name: 'Ethiopia',                      dial: '+251'  },
  { code: 'FJ', name: 'Fiji',                          dial: '+679'  },
  { code: 'FI', name: 'Finland',                       dial: '+358'  },
  { code: 'FR', name: 'France',                        dial: '+33'   },
  { code: 'GA', name: 'Gabon',                         dial: '+241'  },
  { code: 'GM', name: 'Gambia',                        dial: '+220'  },
  { code: 'GE', name: 'Georgia',                       dial: '+995'  },
  { code: 'DE', name: 'Germany',                       dial: '+49'   },
  { code: 'GH', name: 'Ghana',                         dial: '+233'  },
  { code: 'GR', name: 'Greece',                        dial: '+30'   },
  { code: 'GD', name: 'Grenada',                       dial: '+1'    },
  { code: 'GT', name: 'Guatemala',                     dial: '+502'  },
  { code: 'GN', name: 'Guinea',                        dial: '+224'  },
  { code: 'GW', name: 'Guinea-Bissau',                 dial: '+245'  },
  { code: 'GY', name: 'Guyana',                        dial: '+592'  },
  { code: 'HT', name: 'Haiti',                         dial: '+509'  },
  { code: 'HN', name: 'Honduras',                      dial: '+504'  },
  { code: 'HU', name: 'Hungary',                       dial: '+36'   },
  { code: 'IS', name: 'Iceland',                       dial: '+354'  },
  { code: 'IN', name: 'India',                         dial: '+91'   },
  { code: 'ID', name: 'Indonesia',                     dial: '+62'   },
  { code: 'IR', name: 'Iran',                          dial: '+98'   },
  { code: 'IQ', name: 'Iraq',                          dial: '+964'  },
  { code: 'IE', name: 'Ireland',                       dial: '+353'  },
  { code: 'IL', name: 'Israel',                        dial: '+972'  },
  { code: 'IT', name: 'Italy',                         dial: '+39'   },
  { code: 'JM', name: 'Jamaica',                       dial: '+1'    },
  { code: 'JP', name: 'Japan',                         dial: '+81'   },
  { code: 'JO', name: 'Jordan',                        dial: '+962'  },
  { code: 'KZ', name: 'Kazakhstan',                    dial: '+7'    },
  { code: 'KE', name: 'Kenya',                         dial: '+254'  },
  { code: 'KI', name: 'Kiribati',                      dial: '+686'  },
  { code: 'KW', name: 'Kuwait',                        dial: '+965'  },
  { code: 'KG', name: 'Kyrgyzstan',                    dial: '+996'  },
  { code: 'LA', name: 'Laos',                          dial: '+856'  },
  { code: 'LV', name: 'Latvia',                        dial: '+371'  },
  { code: 'LB', name: 'Lebanon',                       dial: '+961'  },
  { code: 'LS', name: 'Lesotho',                       dial: '+266'  },
  { code: 'LR', name: 'Liberia',                       dial: '+231'  },
  { code: 'LY', name: 'Libya',                         dial: '+218'  },
  { code: 'LI', name: 'Liechtenstein',                 dial: '+423'  },
  { code: 'LT', name: 'Lithuania',                     dial: '+370'  },
  { code: 'LU', name: 'Luxembourg',                    dial: '+352'  },
  { code: 'MG', name: 'Madagascar',                    dial: '+261'  },
  { code: 'MW', name: 'Malawi',                        dial: '+265'  },
  { code: 'MY', name: 'Malaysia',                      dial: '+60'   },
  { code: 'MV', name: 'Maldives',                      dial: '+960'  },
  { code: 'ML', name: 'Mali',                          dial: '+223'  },
  { code: 'MT', name: 'Malta',                         dial: '+356'  },
  { code: 'MH', name: 'Marshall Islands',              dial: '+692'  },
  { code: 'MR', name: 'Mauritania',                    dial: '+222'  },
  { code: 'MU', name: 'Mauritius',                     dial: '+230'  },
  { code: 'MX', name: 'Mexico',                        dial: '+52'   },
  { code: 'FM', name: 'Micronesia',                    dial: '+691'  },
  { code: 'MD', name: 'Moldova',                       dial: '+373'  },
  { code: 'MC', name: 'Monaco',                        dial: '+377'  },
  { code: 'MN', name: 'Mongolia',                      dial: '+976'  },
  { code: 'ME', name: 'Montenegro',                    dial: '+382'  },
  { code: 'MA', name: 'Morocco',                       dial: '+212'  },
  { code: 'MZ', name: 'Mozambique',                    dial: '+258'  },
  { code: 'MM', name: 'Myanmar',                       dial: '+95'   },
  { code: 'NA', name: 'Namibia',                       dial: '+264'  },
  { code: 'NR', name: 'Nauru',                         dial: '+674'  },
  { code: 'NP', name: 'Nepal',                         dial: '+977'  },
  { code: 'NL', name: 'Netherlands',                   dial: '+31'   },
  { code: 'NZ', name: 'New Zealand',                   dial: '+64'   },
  { code: 'NI', name: 'Nicaragua',                     dial: '+505'  },
  { code: 'NE', name: 'Niger',                         dial: '+227'  },
  { code: 'NG', name: 'Nigeria',                       dial: '+234'  },
  { code: 'NO', name: 'Norway',                        dial: '+47'   },
  { code: 'OM', name: 'Oman',                          dial: '+968'  },
  { code: 'PK', name: 'Pakistan',                      dial: '+92'   },
  { code: 'PW', name: 'Palau',                         dial: '+680'  },
  { code: 'PA', name: 'Panama',                        dial: '+507'  },
  { code: 'PG', name: 'Papua New Guinea',              dial: '+675'  },
  { code: 'PY', name: 'Paraguay',                      dial: '+595'  },
  { code: 'PE', name: 'Peru',                          dial: '+51'   },
  { code: 'PH', name: 'Philippines',                   dial: '+63'   },
  { code: 'PL', name: 'Poland',                        dial: '+48'   },
  { code: 'PT', name: 'Portugal',                      dial: '+351'  },
  { code: 'QA', name: 'Qatar',                         dial: '+974'  },
  { code: 'RO', name: 'Romania',                       dial: '+40'   },
  { code: 'RU', name: 'Russia',                        dial: '+7'    },
  { code: 'RW', name: 'Rwanda',                        dial: '+250'  },
  { code: 'KN', name: 'Saint Kitts and Nevis',         dial: '+1'    },
  { code: 'LC', name: 'Saint Lucia',                   dial: '+1'    },
  { code: 'VC', name: 'Saint Vincent & the Grenadines',dial: '+1'    },
  { code: 'WS', name: 'Samoa',                         dial: '+685'  },
  { code: 'SM', name: 'San Marino',                    dial: '+378'  },
  { code: 'ST', name: 'Sao Tome and Principe',         dial: '+239'  },
  { code: 'SA', name: 'Saudi Arabia',                  dial: '+966'  },
  { code: 'SN', name: 'Senegal',                       dial: '+221'  },
  { code: 'RS', name: 'Serbia',                        dial: '+381'  },
  { code: 'SC', name: 'Seychelles',                    dial: '+248'  },
  { code: 'SL', name: 'Sierra Leone',                  dial: '+232'  },
  { code: 'SG', name: 'Singapore',                     dial: '+65'   },
  { code: 'SK', name: 'Slovakia',                      dial: '+421'  },
  { code: 'SI', name: 'Slovenia',                      dial: '+386'  },
  { code: 'SB', name: 'Solomon Islands',               dial: '+677'  },
  { code: 'SO', name: 'Somalia',                       dial: '+252'  },
  { code: 'ZA', name: 'South Africa',                  dial: '+27'   },
  { code: 'SS', name: 'South Sudan',                   dial: '+211'  },
  { code: 'ES', name: 'Spain',                         dial: '+34'   },
  { code: 'LK', name: 'Sri Lanka',                     dial: '+94'   },
  { code: 'SD', name: 'Sudan',                         dial: '+249'  },
  { code: 'SR', name: 'Suriname',                      dial: '+597'  },
  { code: 'SE', name: 'Sweden',                        dial: '+46'   },
  { code: 'CH', name: 'Switzerland',                   dial: '+41'   },
  { code: 'SY', name: 'Syria',                         dial: '+963'  },
  { code: 'TW', name: 'Taiwan',                        dial: '+886'  },
  { code: 'TJ', name: 'Tajikistan',                    dial: '+992'  },
  { code: 'TZ', name: 'Tanzania',                      dial: '+255'  },
  { code: 'TH', name: 'Thailand',                      dial: '+66'   },
  { code: 'TL', name: 'Timor-Leste',                   dial: '+670'  },
  { code: 'TG', name: 'Togo',                          dial: '+228'  },
  { code: 'TO', name: 'Tonga',                         dial: '+676'  },
  { code: 'TT', name: 'Trinidad and Tobago',           dial: '+1'    },
  { code: 'TN', name: 'Tunisia',                       dial: '+216'  },
  { code: 'TR', name: 'Turkey',                        dial: '+90'   },
  { code: 'TM', name: 'Turkmenistan',                  dial: '+993'  },
  { code: 'TV', name: 'Tuvalu',                        dial: '+688'  },
  { code: 'UG', name: 'Uganda',                        dial: '+256'  },
  { code: 'UA', name: 'Ukraine',                       dial: '+380'  },
  { code: 'AE', name: 'United Arab Emirates',          dial: '+971'  },
  { code: 'GB', name: 'United Kingdom',                dial: '+44'   },
  { code: 'US', name: 'United States',                 dial: '+1'    },
  { code: 'UY', name: 'Uruguay',                       dial: '+598'  },
  { code: 'UZ', name: 'Uzbekistan',                    dial: '+998'  },
  { code: 'VU', name: 'Vanuatu',                       dial: '+678'  },
  { code: 'VE', name: 'Venezuela',                     dial: '+58'   },
  { code: 'VN', name: 'Vietnam',                       dial: '+84'   },
  { code: 'YE', name: 'Yemen',                         dial: '+967'  },
  { code: 'ZM', name: 'Zambia',                        dial: '+260'  },
  { code: 'ZW', name: 'Zimbabwe',                      dial: '+263'  },
];

const DEFAULT_COUNTRY = COUNTRIES.find(c => c.code === 'AE')!;

// ─── Phone placeholders by country code ──────────────────────────────────────
const PHONE_PLACEHOLDERS: Record<string, string> = {
  AE: '50 123 4567',   SA: '50 123 4567',   QA: '3312 3456',
  KW: '5012 3456',     BH: '3600 1234',     OM: '9212 3456',
  JO: '79 123 4567',   EG: '100 123 4567',  LB: '71 123 456',
  SY: '944 123 456',   IQ: '781 234 5678',  YE: '712 345 678',
  GB: '7911 123456',   US: '(555) 123-4567',CA: '(416) 123-4567',
  FR: '6 12 34 56 78', DE: '151 1234 5678', IT: '312 345 6789',
  ES: '612 345 678',   PT: '912 345 678',   NL: '6 12345678',
  BE: '470 12 34 56',  CH: '78 123 45 67',  AT: '664 123456',
  SE: '70 123 45 67',  NO: '400 12 345',    DK: '20 12 34 56',
  FI: '40 123 4567',   PL: '512 345 678',   CZ: '601 234 567',
  HU: '20 123 4567',   RO: '712 345 678',   BG: '87 123 4567',
  GR: '691 234567',    HR: '91 234 5678',   SK: '901 234 567',
  RS: '60 1234567',    UA: '50 123 4567',   RU: '912 345-67-89',
  TR: '532 123 4567',  IL: '50 123 4567',   IR: '912 345 6789',
  AU: '412 345 678',   NZ: '21 123 4567',   JP: '90-1234-5678',
  CN: '138 1234 5678', KR: '10-1234-5678',  IN: '98765 43210',
  PK: '301 2345678',   BD: '1812 345678',   LK: '71 234 5678',
  MY: '12 345 6789',   SG: '9123 4567',     ID: '812 3456 7890',
  PH: '917 123 4567',  TH: '81 234 5678',   VN: '90 123 4567',
  MM: '9 123 4567',    KH: '12 345 678',    LA: '20 2345 6789',
  NG: '803 123 4567',  GH: '244 123456',    KE: '712 345678',
  TZ: '754 123456',    ET: '911 234567',    ZA: '71 234 5678',
  MA: '61 23 45 67',   TN: '20 123 456',
  DZ: '550 12 34 56',  LY: '91 234 5678',   SD: '912 345678',
  MX: '55 1234 5678',  BR: '(11) 91234-5678',AR: '9 11 1234-5678',
  CO: '310 123 4567',  CL: '9 1234 5678',   PE: '912 345 678',
  VE: '412 123 4567',  EC: '99 123 4567',
};

const phonePlaceholder = (code: string) => PHONE_PLACEHOLDERS[code] ?? '12 345 6789';

// ─── CountrySelect ────────────────────────────────────────────────────────────

function CountrySelect({
  value,
  onChange,
  disabled,
}: {
  value: Country;
  onChange: (c: Country) => void;
  disabled?: boolean;
}) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="country-select" ref={wrapRef}>
      <button
        type="button"
        className="country-select__trigger"
        onClick={() => !disabled && setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
      >
        <span className="country-select__flag">{flag(value.code)}</span>
        <span className="country-select__dial">{value.dial}</span>
        <svg className="country-select__arrow" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d={open ? 'M1 5L5 1L9 5' : 'M1 1L5 5L9 1'} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="country-select__dropdown" role="listbox">
          {COUNTRIES.map(c => (
            <div
              key={c.code}
              className={`country-select__option${c.code === value.code ? ' selected' : ''}`}
              role="option"
              aria-selected={c.code === value.code}
              onMouseDown={() => { onChange(c); setOpen(false); }}
            >
              <span className="country-select__option-flag">{flag(c.code)}</span>
              <span className="country-select__option-name">{localCountryName(c.code, lang)}</span>
              <span className="country-select__option-dial">{c.dial}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 11.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 .82h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z"/>
  </svg>
);

const IconEmail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const IconPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconSnapchat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.166 3C9.315 3 6.926 5.04 6.502 7.763l-.048.316-.319.007c-.387.009-.775.05-1.157.123-.31.06-.562.31-.562.628 0 .306.215.573.516.636.682.141 1.379.205 2.066.19l.017.003c.042.406.14.8.29 1.176-.53.342-1.017.752-1.45 1.22-.598.65-.927 1.5-.927 2.378 0 .276.224.5.5.5.173 0 .334-.088.426-.234.27-.43.615-.803 1.02-1.1a7.065 7.065 0 0 0 1.29 2.067c.49.542 1.087.98 1.754 1.286-.24.45-.56.847-.946 1.173-.5.424-1.09.71-1.714.836-.276.054-.477.294-.477.575 0 .31.248.567.558.575l.017.001c.65 0 1.288-.144 1.87-.421.498-.236.954-.558 1.347-.95.394.392.85.714 1.347.95.582.277 1.22.421 1.87.421l.017-.001c.31-.008.558-.265.558-.575 0-.281-.201-.521-.477-.575-.624-.126-1.214-.412-1.714-.836a4.963 4.963 0 0 1-.946-1.173c.667-.306 1.264-.744 1.754-1.286a7.065 7.065 0 0 0 1.29-2.067c.405.297.75.67 1.02 1.1.092.146.253.234.426.234.276 0 .5-.224.5-.5 0-.878-.329-1.728-.927-2.378a7.316 7.316 0 0 0-1.45-1.22c.15-.376.248-.77.29-1.176l.017-.003c.687.015 1.384-.049 2.066-.19.301-.063.516-.33.516-.636 0-.318-.252-.568-.562-.628a8.09 8.09 0 0 0-1.157-.123l-.319-.007-.048-.316C17.074 5.04 14.685 3 11.834 3H12z"/>
  </svg>
);

const IconTikTok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z"/>
  </svg>
);

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const IconYouTube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

// ─── Form ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';
type FieldErrors = Partial<Record<keyof FormState, string>>;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

export function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', phone: '', email: '', message: '' });
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => {
        const found = COUNTRIES.find(c => c.code === d.country_code);
        if (found) setCountry(found);
      })
      .catch(() => {});
  }, []);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const formVisible = status !== 'success';

  useEffect(() => {
    if (!formVisible) {
      if (widgetIdRef.current !== null) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
        setTurnstileToken('');
      }
      return;
    }

    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
    if (!siteKey) return;

    const doRender = () => {
      if (!turnstileRef.current || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.turnstile!.render(turnstileRef.current, {
        sitekey: siteKey,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      });
    };

    if (window.turnstile) {
      doRender();
      return;
    }

    const t = setInterval(() => {
      if (window.turnstile) { clearInterval(t); doRender(); }
    }, 50);
    return () => clearInterval(t);
  }, [formVisible]);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      if (fieldErrors[field]) setFieldErrors(fe => ({ ...fe, [field]: undefined }));
    };

  const validateFields = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)                     e.name    = t.contact.errors.nameRequired;
    if (!form.phone.trim() || form.phone.trim().length < 5)                   e.phone   = t.contact.errors.phoneRequired;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email   = t.contact.errors.emailRequired;
    if (!form.message.trim() || form.message.trim().length < 3)               e.message = t.contact.errors.messageRequired;
    return e;
  };

  const resetTurnstile = () => {
    if (widgetIdRef.current !== null) window.turnstile?.reset(widgetIdRef.current);
    setTurnstileToken('');
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (import.meta.env.VITE_TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMsg(t.contact.errors.captchaRequired);
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const fullPhone = form.phone.trim() ? `${country.dial} ${form.phone.trim()}` : '';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, phone: fullPhone, turnstileToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        resetTurnstile();
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setStatus('error');
    }
  };

  const handleReset = () => {
    setForm({ name: '', phone: '', email: '', message: '' });
    setCountry(DEFAULT_COUNTRY);
    setStatus('idle');
    setErrorMsg('');
    setFieldErrors({});
    setTurnstileToken('');
  };

  const { t } = useLang();
  const loading = status === 'loading';

  return (
    <div className="page" id="contact-page">
      {/* HEADER */}
      <section id="contact-header" className="contact-header">
        <div className="container">
          <div className="eyebrow contact-eyebrow">
            <span className="dot"></span>{t.contact.headerEyebrow}
          </div>
          <h1 className="display contact-title">
            {t.contact.headerL1}<br />
            <em>{t.contact.headerEm}</em>
          </h1>
        </div>
      </section>

      {/* MAIN */}
      <section id="contact-main" className="contact-main">
        <div className="container">
          <div className="contact-grid">

            {/* ── Contact info (left) ── */}
            <div id="contact-info-col">
              <p className="contact-intro">{t.contact.intro}</p>

              <div className="contact-info-list">
                <div className="contact-info-row">
                  <span className="contact-info-icon"><IconPhone /></span>
                  <div>
                    <div className="label">{t.contact.phone}</div>
                    <div className="value">+971 600 551 615</div>
                  </div>
                </div>

                <div className="contact-info-row">
                  <span className="contact-info-icon"><IconEmail /></span>
                  <div>
                    <div className="label">{t.contact.email}</div>
                    <div className="value">customer.service@everlastwellness.com</div>
                  </div>
                </div>

                <div className="contact-info-row">
                  <span className="contact-info-icon"><IconPin /></span>
                  <div>
                    <div className="label">{t.contact.address}</div>
                    <div className="value">{t.contact.address1}</div>
                    <div className="sub">{t.contact.address2}</div>
                  </div>
                </div>

                <div className="contact-info-row">
                  <span className="contact-info-icon"><IconClock /></span>
                  <div>
                    <div className="label">{t.contact.hours}</div>
                    <div className="value">{t.contact.satHours}</div>
                    <div className="value">{t.contact.sunFriHours}</div>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <div className="label">{t.contact.followUs}</div>
                <div className="contact-social-links">
                  <a href="https://www.snapchat.com/@everlastwmc" className="contact-social-link" aria-label="Snapchat" target="_blank" rel="noopener noreferrer"><IconSnapchat /></a>
                  <a href="https://www.tiktok.com/@everlastwellness" className="contact-social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer"><IconTikTok /></a>
                  <a href="https://www.instagram.com/everlastwellness/" className="contact-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><IconInstagram /></a>
                  <a href="https://www.youtube.com/channel/UC8BxCEjG34knpcKLoFLNUgg" className="contact-social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><IconYouTube /></a>
                  <a href="https://www.linkedin.com/company/everlastwellnessmc/" className="contact-social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><IconLinkedIn /></a>
                </div>
              </div>
            </div>

            {/* ── Contact form (right) ── */}
            <div id="contact-form-col">
              <div className="eyebrow eyebrow-mb"><span className="dot"></span>{t.contact.formEyebrow}</div>
              <p className="contact-form-subtitle">{t.contact.formSubtitle}</p>

              {status === 'success' ? (
                <div className="contact-success">
                  <div className="contact-success-mark">✦</div>
                  <h3 className="contact-success-title">{t.contact.successTitle}</h3>
                  <p className="contact-success-desc">{t.contact.successDesc}</p>
                  <a className="btn" onClick={handleReset}>
                    {t.contact.successBtn} <span className="arrow"></span>
                  </a>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="field">
                    <label>{t.contact.fullName}</label>
                    <input
                      placeholder={t.contact.fullNamePlaceholder}
                      value={form.name}
                      onChange={set('name')}
                      disabled={loading}
                      className={fieldErrors.name ? 'input-error' : ''}
                    />
                    {fieldErrors.name && <p className="field-error-msg">{fieldErrors.name}</p>}
                  </div>

                  <div className="field">
                    <label>{t.contact.phoneNumber}</label>
                    <div className={`phone-input-wrap${fieldErrors.phone ? ' input-error' : ''}`}>
                      <CountrySelect value={country} onChange={setCountry} disabled={loading} />
                      <input
                        className="phone-input-wrap__input"
                        placeholder={phonePlaceholder(country.code)}
                        value={form.phone}
                        onChange={set('phone')}
                        disabled={loading}
                        inputMode="tel"
                      />
                    </div>
                    {fieldErrors.phone && <p className="field-error-msg">{fieldErrors.phone}</p>}
                  </div>

                  <div className="field">
                    <label>{t.contact.emailAddress}</label>
                    <input
                      type="email"
                      placeholder={t.contact.emailPlaceholder}
                      value={form.email}
                      onChange={set('email')}
                      disabled={loading}
                      className={fieldErrors.email ? 'input-error' : ''}
                    />
                    {fieldErrors.email && <p className="field-error-msg">{fieldErrors.email}</p>}
                  </div>

                  <div className="field">
                    <label>{t.contact.message}</label>
                    <textarea
                      rows={5}
                      placeholder={t.contact.messagePlaceholder}
                      value={form.message}
                      onChange={set('message')}
                      disabled={loading}
                      className={fieldErrors.message ? 'input-error' : ''}
                    />
                    {fieldErrors.message && <p className="field-error-msg">{fieldErrors.message}</p>}
                  </div>

                  <div ref={turnstileRef} className="contact-turnstile" />

                  {status === 'error' && (
                    <div className="contact-error">{errorMsg}</div>
                  )}

                  <button type="submit" className="btn btn-solid contact-submit-btn" disabled={loading}>
                    {loading ? t.contact.sending : <>{t.contact.sendMessage} <span className="arrow"></span></>}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
