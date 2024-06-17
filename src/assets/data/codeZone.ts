// data of wu (unit: m^3), adpe (unit: kgSbe), citations : https://github.com/digital4better/data/tree/main)
// data of carbon-intensity-electricity (carbonFactor), citations : “Data Page: Carbon intensity of electricity generation”, part of the following publication: Hannah Ritchie, Pablo Rosado and Max Roser (2023) - “Energy”. Data adapted from Ember, Energy Institute. Retrieved from https://ourworldindata.org/grapher/carbon-intensity-electricity [online resource]
// zoneAlpha2 (ISO 3166-1) and zoneAlpha3 (ISO 3166-1) are the country code
import type { Zone } from '../../interface';

export const codeZone: Zone[] = [
  {
    countryName: 'Afghanistan',
    country: 'Afghanistan',
    continent: 'Asia',
    zoneAlpha3: 'AFG',
    zoneAlpha2: 'AF',
    wu: 0.0735123,
    adpe: 7.3327e-7,
    carbonFactor: 132.53012
  },
  {
    countryName: 'Albania',
    country: 'Albania',
    continent: 'Europe',
    zoneAlpha3: 'ALB',
    zoneAlpha2: 'AL',
    wu: 0.0208741,
    adpe: 2.91644e-7,
    carbonFactor: 24.285715
  },
  {
    countryName: 'Algeria',
    country: 'Algeria',
    continent: 'Africa',
    zoneAlpha3: 'DZA',
    zoneAlpha2: 'DZ',
    wu: 0.0498552,
    adpe: 2.85931e-7,
    carbonFactor: 634.611
  },
  {
    countryName: 'American Samoa',
    country: 'American Samoa',
    continent: 'South America',
    zoneAlpha3: 'ASM',
    zoneAlpha2: 'AS',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 611.1111
  },
  {
    countryName: 'Angola',
    country: 'Angola',
    continent: 'Africa',
    zoneAlpha3: 'AGO',
    zoneAlpha2: 'AO',
    wu: 0.0138492,
    adpe: 1.16483e-7,
    carbonFactor: 174.73436
  },
  {
    countryName: 'Antigua and Barbuda',
    country: 'Antigua and Barbuda',
    continent: 'North America',
    zoneAlpha3: 'ATG',
    zoneAlpha2: 'AG',
    wu: 0.0429607,
    adpe: 3.75394e-7,
    carbonFactor: 611.1111
  },
  {
    countryName: 'Argentina',
    country: 'Argentina',
    continent: 'South America',
    zoneAlpha3: 'ARG',
    zoneAlpha2: 'AR',
    wu: 0.03679,
    adpe: 3.75773e-7,
    carbonFactor: 394.61646
  },
  {
    countryName: 'Armenia',
    country: 'Armenia',
    continent: 'Europe',
    zoneAlpha3: 'ARM',
    zoneAlpha2: 'AM',
    wu: 0.0566561,
    adpe: 2.51889e-7,
    carbonFactor: 264.53815
  },
  {
    countryName: 'Aruba',
    country: 'Aruba',
    continent: 'North America',
    zoneAlpha3: 'ABW',
    zoneAlpha2: 'AW',
    wu: 0.0381083,
    adpe: 3.48083e-7,
    carbonFactor: 561.2245
  },
  {
    countryName: 'Australia',
    country: 'Australia',
    continent: 'Oceania',
    zoneAlpha3: 'AUS',
    zoneAlpha2: 'AU',
    wu: 0.0759146,
    adpe: 0.0000013875,
    carbonFactor: 570.35284
  },
  {
    countryName: 'Austria',
    country: 'Austria',
    continent: 'Europe',
    zoneAlpha3: 'AUT',
    zoneAlpha2: 'AT',
    wu: 0.0147527,
    adpe: 4.09268e-7,
    carbonFactor: 141.78989
  },
  {
    countryName: 'Azerbaijan',
    country: 'Azerbaijan',
    continent: 'Europe',
    zoneAlpha3: 'AZE',
    zoneAlpha2: 'AZ',
    wu: 0.0472016,
    adpe: 2.43457e-7,
    carbonFactor: 671.38904
  },
  {
    countryName: 'Bahamas',
    country: 'Bahamas',
    continent: 'North America',
    zoneAlpha3: 'BHS',
    zoneAlpha2: 'BS',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 660.0986
  },
  {
    countryName: 'Bahrain',
    country: 'Bahrain',
    continent: 'Asia',
    zoneAlpha3: 'BHR',
    zoneAlpha2: 'BH',
    wu: 0.0501883,
    adpe: 2.4466e-7,
    carbonFactor: 904.6145
  },
  {
    countryName: 'Bangladesh',
    country: 'Bangladesh',
    continent: 'Asia',
    zoneAlpha3: 'BGD',
    zoneAlpha2: 'BD',
    wu: 0.0673806,
    adpe: 4.23325e-7,
    carbonFactor: 678.1058
  },
  {
    countryName: 'Barbados',
    country: 'Barbados',
    continent: 'North America',
    zoneAlpha3: 'BRB',
    zoneAlpha2: 'BB',
    wu: 0.0429582,
    adpe: 4.27539e-7,
    carbonFactor: 605.5046
  },
  {
    countryName: 'Belarus',
    country: 'Belarus',
    continent: 'Europe',
    zoneAlpha3: 'BLR',
    zoneAlpha2: 'BY',
    wu: 0.0497514,
    adpe: 2.70415e-7,
    carbonFactor: 441.74
  },
  {
    countryName: 'Belgium',
    country: 'Belgium',
    continent: 'Europe',
    zoneAlpha3: 'BEL',
    zoneAlpha2: 'BE',
    wu: 0.0714832,
    adpe: 8.4796e-7,
    carbonFactor: 139.79181
  },
  {
    countryName: 'Belize',
    country: 'Belize',
    continent: 'North America',
    zoneAlpha3: 'BLZ',
    zoneAlpha2: 'BZ',
    wu: 0.0287577,
    adpe: 4.74018e-7,
    carbonFactor: 225.80646
  },
  {
    countryName: 'Benin',
    country: 'Benin',
    continent: 'Africa',
    zoneAlpha3: 'BEN',
    zoneAlpha2: 'BJ',
    wu: 0.0584299,
    adpe: 4.20324e-7,
    carbonFactor: 584.0708
  },
  {
    countryName: 'Bermuda',
    country: 'Bermuda',
    continent: 'North America',
    zoneAlpha3: 'BMU',
    zoneAlpha2: 'BM',
    wu: 0.0441052,
    adpe: 2.38036e-7,
    carbonFactor: 650.79364
  },
  {
    countryName: 'Bhutan',
    country: 'Bhutan',
    continent: 'Asia',
    zoneAlpha3: 'BTN',
    zoneAlpha2: 'BT',
    wu: 0.00166,
    adpe: 6.06e-8,
    carbonFactor: 23.333334
  },
  {
    countryName: 'Bolivia',
    country: 'Bolivia',
    continent: 'South America',
    zoneAlpha3: 'BOL',
    zoneAlpha2: 'BO',
    wu: 0.0377803,
    adpe: 3.95133e-7,
    carbonFactor: 489.13986
  },
  {
    countryName: 'Bosnia and Herzegovina',
    country: 'Bosnia and Herzegovina',
    continent: 'Europe',
    zoneAlpha3: 'BIH',
    zoneAlpha2: 'BA',
    wu: 0.0762406,
    adpe: 4.09302e-7,
    carbonFactor: 670.09064
  },
  {
    countryName: 'Botswana',
    country: 'Botswana',
    continent: 'Africa',
    zoneAlpha3: 'BWA',
    zoneAlpha2: 'BW',
    wu: 0.1058,
    adpe: 5.21247e-7,
    carbonFactor: 847.9087
  },
  {
    countryName: 'Brazil',
    country: 'Brazil',
    continent: 'South America',
    zoneAlpha3: 'BRA',
    zoneAlpha2: 'BR',
    wu: 0.0126069,
    adpe: 6.01906e-7,
    carbonFactor: 105.51264
  },
  {
    countryName: 'British Virgin Islands',
    country: 'British Virgin Islands',
    continent: 'North America',
    zoneAlpha3: 'VGB',
    zoneAlpha2: 'VG',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 647.0588
  },
  {
    countryName: 'Brunei',
    country: 'Brunei',
    continent: 'Asia',
    zoneAlpha3: 'BRN',
    zoneAlpha2: 'BN',
    wu: 0.057223,
    adpe: 2.70336e-7,
    carbonFactor: 893.913
  },
  {
    countryName: 'Bulgaria',
    country: 'Bulgaria',
    continent: 'Europe',
    zoneAlpha3: 'BGR',
    zoneAlpha2: 'BG',
    wu: 0.10033,
    adpe: 7.85451e-7,
    carbonFactor: 476.90164
  },
  {
    countryName: 'Burkina Faso',
    country: 'Burkina Faso',
    continent: 'Africa',
    zoneAlpha3: 'BFA',
    zoneAlpha2: 'BF',
    wu: 0.0518179,
    adpe: 6.32052e-7,
    carbonFactor: 467.5325
  },
  {
    countryName: 'Burundi',
    country: 'Burundi',
    continent: 'Africa',
    zoneAlpha3: 'BDI',
    zoneAlpha2: 'BI',
    wu: 0.0283353,
    adpe: 3.24054e-7,
    carbonFactor: 250.00002
  },
  {
    countryName: 'Cambodia',
    country: 'Cambodia',
    continent: 'Asia',
    zoneAlpha3: 'KHM',
    zoneAlpha2: 'KH',
    wu: 0.0666776,
    adpe: 4.77299e-7,
    carbonFactor: 417.70712
  },
  {
    countryName: 'Cameroon',
    country: 'Cameroon',
    continent: 'Africa',
    zoneAlpha3: 'CMR',
    zoneAlpha2: 'CM',
    wu: 0.0195681,
    adpe: 1.44155e-7,
    carbonFactor: 305.4187
  },
  {
    countryName: 'Canada',
    country: 'Canada',
    continent: 'North America',
    zoneAlpha3: 'CAN',
    zoneAlpha2: 'CA',
    wu: 0.0336266,
    adpe: 2.39169e-7,
    carbonFactor: 161.43408
  },
  {
    countryName: 'Cape Verde',
    country: 'Cape Verde',
    continent: 'Africa',
    zoneAlpha3: 'CPV',
    zoneAlpha2: 'CV',
    wu: 0.0373352,
    adpe: 4.1952e-7,
    carbonFactor: 558.1395
  },
  {
    countryName: 'Cayman Islands',
    country: 'Cayman Islands',
    continent: 'North America',
    zoneAlpha3: 'CYM',
    zoneAlpha2: 'KY',
    wu: 0.0429607,
    adpe: 3.75394e-7,
    carbonFactor: 642.8571
  },
  {
    countryName: 'Central African Republic',
    country: 'Central African Republic',
    continent: 'Africa',
    zoneAlpha3: 'CAF',
    zoneAlpha2: 'CF',
    wu: 0.00166,
    adpe: 6.06e-8,
    carbonFactor: 108.3
  },
  {
    countryName: 'Chad',
    country: 'Chad',
    continent: 'Africa',
    zoneAlpha3: 'TCD',
    zoneAlpha2: 'TD',
    wu: 0.0435279,
    adpe: 2.5833e-7,
    carbonFactor: 628.5714
  },
  {
    countryName: 'Chile',
    country: 'Chile',
    continent: 'South America',
    zoneAlpha3: 'CHL',
    zoneAlpha2: 'CL',
    wu: 0.0387266,
    adpe: 0.0000014112,
    carbonFactor: 353.52075
  },
  {
    countryName: 'China',
    country: 'China',
    continent: 'Asia',
    zoneAlpha3: 'CHN',
    zoneAlpha2: 'CN',
    wu: 0.0879157,
    adpe: 7.77183e-7,
    carbonFactor: 585.82074
  },
  {
    countryName: 'Colombia',
    country: 'Colombia',
    continent: 'South America',
    zoneAlpha3: 'COL',
    zoneAlpha2: 'CO',
    wu: 0.0186424,
    adpe: 2.11753e-7,
    carbonFactor: 214.88087
  },
  {
    countryName: 'Comoros',
    country: 'Comoros',
    continent: 'Africa',
    zoneAlpha3: 'COM',
    zoneAlpha2: 'KM',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 642.8572
  },
  {
    countryName: 'Congo',
    country: 'Congo',
    continent: 'Africa',
    zoneAlpha3: 'COG',
    zoneAlpha2: 'CG',
    wu: 0.0385994,
    adpe: 2.00007e-7,
    carbonFactor: 700
  },
  {
    countryName: 'Cook Islands',
    country: 'Cook Islands',
    continent: 'Oceania',
    zoneAlpha3: 'COK',
    zoneAlpha2: 'CK',
    wu: 0.03865,
    adpe: 0.0000015375,
    carbonFactor: 250
  },
  {
    countryName: 'Costa Rica',
    country: 'Costa Rica',
    continent: 'North America',
    zoneAlpha3: 'CRI',
    zoneAlpha2: 'CR',
    wu: 0.0093835,
    adpe: 0.00000186402,
    carbonFactor: 26.463512
  },
  {
    countryName: 'Cote d\'Ivoire',
    country: 'Cote d\'Ivoire',
    continent: 'Africa',
    zoneAlpha3: 'CIV',
    zoneAlpha2: 'CI',
    wu: 0.0346572,
    adpe: 1.91783e-7,
    carbonFactor: 393.8849
  },
  {
    countryName: 'Croatia',
    country: 'Croatia',
    continent: 'Europe',
    zoneAlpha3: 'HRV',
    zoneAlpha2: 'HR',
    wu: 0.03265,
    adpe: 5.88833e-7,
    carbonFactor: 242.27528
  },
  {
    countryName: 'Cuba',
    country: 'Cuba',
    continent: 'North America',
    zoneAlpha3: 'CUB',
    zoneAlpha2: 'CU',
    wu: 0.0446823,
    adpe: 3.01182e-7,
    carbonFactor: 637.6096
  },
  {
    countryName: 'Cyprus',
    country: 'Cyprus',
    continent: 'Europe',
    zoneAlpha3: 'CYP',
    zoneAlpha2: 'CY',
    wu: 0.0388099,
    adpe: 0.00000109701,
    carbonFactor: 555.13306
  },
  {
    countryName: 'Czechia',
    country: 'Czechia',
    continent: 'Europe',
    zoneAlpha3: 'CZE',
    zoneAlpha2: 'CZ',
    wu: 0.107898,
    adpe: 0.00000107823,
    carbonFactor: 488.29712
  },
  {
    countryName: 'Democratic Republic of Congo',
    country: 'Democratic Republic of Congo',
    continent: 'Africa',
    zoneAlpha3: 'COD',
    zoneAlpha2: 'CD',
    wu: 0.00801506,
    adpe: 1.08972e-7,
    carbonFactor: 24.456524
  },
  {
    countryName: 'Denmark',
    country: 'Denmark',
    continent: 'Europe',
    zoneAlpha3: 'DNK',
    zoneAlpha2: 'DK',
    wu: 0.0358236,
    adpe: 0.00000104252,
    carbonFactor: 201.77702
  },
  {
    countryName: 'Djibouti',
    country: 'Djibouti',
    continent: 'Africa',
    zoneAlpha3: 'DJI',
    zoneAlpha2: 'DJ',
    wu: 0.0609566,
    adpe: 4.27933e-7,
    carbonFactor: 692.3078
  },
  {
    countryName: 'Dominica',
    country: 'Dominica',
    continent: 'North America',
    zoneAlpha3: 'DMA',
    zoneAlpha2: 'DM',
    wu: 0.0375211,
    adpe: 2.05793e-7,
    carbonFactor: 529.4118
  },
  {
    countryName: 'Dominican Republic',
    country: 'Dominican Republic',
    continent: 'North America',
    zoneAlpha3: 'DOM',
    zoneAlpha2: 'DO',
    wu: 0.0518634,
    adpe: 3.79151e-7,
    carbonFactor: 580.7799
  },
  {
    countryName: 'East Timor',
    country: 'East Timor',
    continent: 'Asia',
    zoneAlpha3: 'TLS',
    zoneAlpha2: 'TL',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 666.6667
  },
  {
    countryName: 'Ecuador',
    country: 'Ecuador',
    continent: 'South America',
    zoneAlpha3: 'ECU',
    zoneAlpha2: 'EC',
    wu: 0.0140526,
    adpe: 1.32986e-7,
    carbonFactor: 150.68912
  },
  {
    countryName: 'Egypt',
    country: 'Egypt',
    continent: 'Africa',
    zoneAlpha3: 'EGY',
    zoneAlpha2: 'EG',
    wu: 0.0442332,
    adpe: 4.63054e-7,
    carbonFactor: 570.12695
  },
  {
    countryName: 'El Salvador',
    country: 'El Salvador',
    continent: 'North America',
    zoneAlpha3: 'SLV',
    zoneAlpha2: 'SV',
    wu: 0.0344692,
    adpe: 0.00000356431,
    carbonFactor: 116.53543
  },
  {
    countryName: 'Equatorial Guinea',
    country: 'Equatorial Guinea',
    continent: 'Africa',
    zoneAlpha3: 'GNQ',
    zoneAlpha2: 'GQ',
    wu: 0.0345467,
    adpe: 1.8426e-7,
    carbonFactor: 591.83673
  },
  {
    countryName: 'Eritrea',
    country: 'Eritrea',
    continent: 'Africa',
    zoneAlpha3: 'ERI',
    zoneAlpha2: 'ER',
    wu: 0.0429607,
    adpe: 3.75394e-7,
    carbonFactor: 631.5789
  },
  {
    countryName: 'Estonia',
    country: 'Estonia',
    continent: 'Europe',
    zoneAlpha3: 'EST',
    zoneAlpha2: 'EE',
    wu: 0.0481853,
    adpe: 9.91446e-7,
    carbonFactor: 489.8877
  },
  {
    countryName: 'Eswatini',
    country: 'Eswatini',
    continent: 'Africa',
    zoneAlpha3: 'SWZ',
    zoneAlpha2: 'SZ',
    wu: 0.0585538,
    adpe: 4.40989e-7,
    carbonFactor: 172.41379
  },
  {
    countryName: 'Ethiopia',
    country: 'Ethiopia',
    continent: 'Africa',
    zoneAlpha3: 'ETH',
    zoneAlpha2: 'ET',
    wu: 0.00211327,
    adpe: 9.39398e-8,
    carbonFactor: 24.643318
  },
  {
    countryName: 'Falkland Islands',
    country: 'Falkland Islands',
    continent: 'South America',
    zoneAlpha3: 'FLK',
    zoneAlpha2: 'FK',
    wu: 0.02551,
    adpe: 4.525e-7,
    carbonFactor: 500
  },
  {
    countryName: 'Faroe Islands',
    country: 'Faroe Islands',
    continent: 'Europe',
    zoneAlpha3: 'FRO',
    zoneAlpha2: 'FO',
    wu: 0.0277571,
    adpe: 2.43999e-7,
    carbonFactor: 404.76193
  },
  {
    countryName: 'Fiji',
    country: 'Fiji',
    continent: 'Oceania',
    zoneAlpha3: 'FJI',
    zoneAlpha2: 'FJ',
    wu: 0.0229895,
    adpe: 2.07669e-7,
    carbonFactor: 288.46158
  },
  {
    countryName: 'Finland',
    country: 'Finland',
    continent: 'Europe',
    zoneAlpha3: 'FIN',
    zoneAlpha2: 'FI',
    wu: 0.0720575,
    adpe: 4.40469e-7,
    carbonFactor: 130.23512
  },
  {
    countryName: 'France',
    country: 'France',
    continent: 'Europe',
    zoneAlpha3: 'FRA',
    zoneAlpha2: 'FR',
    wu: 0.0940707,
    adpe: 5.66019e-7,
    carbonFactor: 78.81113
  },
  {
    countryName: 'French Polynesia',
    country: 'French Polynesia',
    continent: 'Oceania',
    zoneAlpha3: 'PYF',
    zoneAlpha2: 'PF',
    wu: 0.031797,
    adpe: 4.81483e-7,
    carbonFactor: 442.85715
  },
  {
    countryName: 'Gabon',
    country: 'Gabon',
    continent: 'Africa',
    zoneAlpha3: 'GAB',
    zoneAlpha2: 'GA',
    wu: 0.0354881,
    adpe: 2.21256e-7,
    carbonFactor: 491.59662
  },
  {
    countryName: 'Gambia',
    country: 'Gambia',
    continent: 'Africa',
    zoneAlpha3: 'GMB',
    zoneAlpha2: 'GM',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 666.6667
  },
  {
    countryName: 'Georgia',
    country: 'Georgia',
    continent: 'Europe',
    zoneAlpha3: 'GEO',
    zoneAlpha2: 'GE',
    wu: 0.0185686,
    adpe: 1.52283e-7,
    carbonFactor: 167.01755
  },
  {
    countryName: 'Germany',
    country: 'Germany',
    continent: 'Europe',
    zoneAlpha3: 'DEU',
    zoneAlpha2: 'DE',
    wu: 0.0550011,
    adpe: 0.00000111998,
    carbonFactor: 420.05743
  },
  {
    countryName: 'Ghana',
    country: 'Ghana',
    continent: 'Africa',
    zoneAlpha3: 'GHA',
    zoneAlpha2: 'GH',
    wu: 0.0287417,
    adpe: 1.80185e-7,
    carbonFactor: 484.00003
  },
  {
    countryName: 'Gibraltar',
    country: 'Gibraltar',
    continent: 'Europe',
    zoneAlpha3: 'GIB',
    zoneAlpha2: 'GI',
    wu: 0.0456319,
    adpe: 2.34137e-7,
    carbonFactor: 600.00006
  },
  {
    countryName: 'Greece',
    country: 'Greece',
    continent: 'Europe',
    zoneAlpha3: 'GRC',
    zoneAlpha2: 'GR',
    wu: 0.0419826,
    adpe: 0.00000129535,
    carbonFactor: 376.6712
  },
  {
    countryName: 'Greenland',
    country: 'Greenland',
    continent: 'North America',
    zoneAlpha3: 'GRL',
    zoneAlpha2: 'GL',
    wu: 0.0119234,
    adpe: 1.02154e-7,
    carbonFactor: 178.57143
  },
  {
    countryName: 'Grenada',
    country: 'Grenada',
    continent: 'North America',
    zoneAlpha3: 'GRD',
    zoneAlpha2: 'GD',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 640
  },
  {
    countryName: 'Guam',
    country: 'Guam',
    continent: 'Oceania',
    zoneAlpha3: 'GUM',
    zoneAlpha2: 'GU',
    wu: 0.0427201,
    adpe: 4.40246e-7,
    carbonFactor: 622.8572
  },
  {
    countryName: 'Guatemala',
    country: 'Guatemala',
    continent: 'North America',
    zoneAlpha3: 'GTM',
    zoneAlpha2: 'GT',
    wu: 0.0617069,
    adpe: 8.1428e-7,
    carbonFactor: 328.26752
  },
  {
    countryName: 'Guinea',
    country: 'Guinea',
    continent: 'Africa',
    zoneAlpha3: 'GIN',
    zoneAlpha2: 'GN',
    wu: 0.0169843,
    adpe: 1.74674e-7,
    carbonFactor: 236.84212
  },
  {
    countryName: 'Guinea-Bissau',
    country: 'Guinea-Bissau',
    continent: 'Africa',
    zoneAlpha3: 'GNB',
    zoneAlpha2: 'GW',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 625
  },
  {
    countryName: 'Guyana',
    country: 'Guyana',
    continent: 'South America',
    zoneAlpha3: 'GUY',
    zoneAlpha2: 'GY',
    wu: 0.0434852,
    adpe: 3.25837e-7,
    carbonFactor: 640.3509
  },
  {
    countryName: 'Haiti',
    country: 'Haiti',
    continent: 'North America',
    zoneAlpha3: 'HTI',
    zoneAlpha2: 'HT',
    wu: 0.0367889,
    adpe: 2.02828e-7,
    carbonFactor: 567.3077
  },
  {
    countryName: 'Honduras',
    country: 'Honduras',
    continent: 'North America',
    zoneAlpha3: 'HND',
    zoneAlpha2: 'HN',
    wu: 0.0341379,
    adpe: 0.00000118214,
    carbonFactor: 282.26477
  },
  {
    countryName: 'Hong Kong',
    country: 'Hong Kong',
    continent: 'Asia',
    zoneAlpha3: 'HKG',
    zoneAlpha2: 'HK',
    wu: 0.0903513,
    adpe: 5.09978e-7,
    carbonFactor: 699.49915
  },
  {
    countryName: 'Hungary',
    country: 'Hungary',
    continent: 'Europe',
    zoneAlpha3: 'HUN',
    zoneAlpha2: 'HU',
    wu: 0.0810067,
    adpe: 0.00000120027,
    carbonFactor: 228.74722
  },
  {
    countryName: 'Iceland',
    country: 'Iceland',
    continent: 'Europe',
    zoneAlpha3: 'ISL',
    zoneAlpha2: 'IS',
    wu: 0.0116585,
    adpe: 0.00000445826,
    carbonFactor: 27.679918
  },
  {
    countryName: 'India',
    country: 'India',
    continent: 'Asia',
    zoneAlpha3: 'IND',
    zoneAlpha2: 'IN',
    wu: 0.0986951,
    adpe: 8.32443e-7,
    carbonFactor: 705.1314
  },
  {
    countryName: 'Indonesia',
    country: 'Indonesia',
    continent: 'Asia',
    zoneAlpha3: 'IDN',
    zoneAlpha2: 'ID',
    wu: 0.0898358,
    adpe: 0.00000108404,
    carbonFactor: 675.9309
  },
  {
    countryName: 'Iran',
    country: 'Iran',
    continent: 'Asia',
    zoneAlpha3: 'IRN',
    zoneAlpha2: 'IR',
    wu: 0.0466046,
    adpe: 2.30783e-7,
    carbonFactor: 665.15375
  },
  {
    countryName: 'Iraq',
    country: 'Iraq',
    continent: 'Asia',
    zoneAlpha3: 'IRQ',
    zoneAlpha2: 'IQ',
    wu: 0.0452111,
    adpe: 2.35166e-7,
    carbonFactor: 688.81396
  },
  {
    countryName: 'Ireland',
    country: 'Ireland',
    continent: 'Europe',
    zoneAlpha3: 'IRL',
    zoneAlpha2: 'IE',
    wu: 0.0377087,
    adpe: 5.11675e-7,
    carbonFactor: 333.23404
  },
  {
    countryName: 'Israel',
    country: 'Israel',
    continent: 'Asia',
    zoneAlpha3: 'ISR',
    zoneAlpha2: 'IL',
    wu: 0.0709878,
    adpe: 5.54439e-7,
    carbonFactor: 582.9271
  },
  {
    countryName: 'Italy',
    country: 'Italy',
    continent: 'Europe',
    zoneAlpha3: 'ITA',
    zoneAlpha2: 'IT',
    wu: 0.044335,
    adpe: 0.000001171,
    carbonFactor: 378.44693
  },
  {
    countryName: 'Jamaica',
    country: 'Jamaica',
    continent: 'North America',
    zoneAlpha3: 'JAM',
    zoneAlpha2: 'JM',
    wu: 0.0419674,
    adpe: 3.6247e-7,
    carbonFactor: 555.55554
  },
  {
    countryName: 'Japan',
    country: 'Japan',
    continent: 'Asia',
    zoneAlpha3: 'JPN',
    zoneAlpha2: 'JP',
    wu: 0.0716936,
    adpe: 0.00000109931,
    carbonFactor: 512.80536
  },
  {
    countryName: 'Jordan',
    country: 'Jordan',
    continent: 'Asia',
    zoneAlpha3: 'JOR',
    zoneAlpha2: 'JO',
    wu: 0.0454274,
    adpe: 7.80651e-7,
    carbonFactor: 540.92365
  },
  {
    countryName: 'Kazakhstan',
    country: 'Kazakhstan',
    continent: 'Europe',
    zoneAlpha3: 'KAZ',
    zoneAlpha2: 'KZ',
    wu: 0.0930885,
    adpe: 5.18334e-7,
    carbonFactor: 830.40875
  },
  {
    countryName: 'Kenya',
    country: 'Kenya',
    continent: 'Africa',
    zoneAlpha3: 'KEN',
    zoneAlpha2: 'KE',
    wu: 0.0264327,
    adpe: 0.00000677108,
    carbonFactor: 83.333336
  },
  {
    countryName: 'Kiribati',
    country: 'Kiribati',
    continent: 'Oceania',
    zoneAlpha3: 'KIR',
    zoneAlpha2: 'KI',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 666.6667
  },
  {
    countryName: 'Kosovo',
    country: 'Kosovo',
    continent: '',
    zoneAlpha3: 'XKX',
    zoneAlpha2: 'XK',
    wu: 0.102094,
    adpe: 5.28662e-7,
    carbonFactor: 945.0073
  },
  {
    countryName: 'Kuwait',
    country: 'Kuwait',
    continent: 'Asia',
    zoneAlpha3: 'KWT',
    zoneAlpha2: 'KW',
    wu: 0.0474087,
    adpe: 2.37584e-7,
    carbonFactor: 649.1959
  },
  {
    countryName: 'Kyrgyzstan',
    country: 'Kyrgyzstan',
    continent: 'Asia',
    zoneAlpha3: 'KGZ',
    zoneAlpha2: 'KG',
    wu: 0.0112254,
    adpe: 9.7214e-8,
    carbonFactor: 147.2924
  },
  {
    countryName: 'Laos',
    country: 'Laos',
    continent: 'Asia',
    zoneAlpha3: 'LAO',
    zoneAlpha2: 'LA',
    wu: 0.0461285,
    adpe: 2.38273e-7,
    carbonFactor: 265.50595
  },
  {
    countryName: 'Latvia',
    country: 'Latvia',
    continent: 'Europe',
    zoneAlpha3: 'LVA',
    zoneAlpha2: 'LV',
    wu: 0.0311592,
    adpe: 3.61206e-7,
    carbonFactor: 136.27257
  },
  {
    countryName: 'Lebanon',
    country: 'Lebanon',
    continent: 'Asia',
    zoneAlpha3: 'LBN',
    zoneAlpha2: 'LB',
    wu: 0.0416192,
    adpe: 2.53071e-7,
    carbonFactor: 599.005
  },
  {
    countryName: 'Lesotho',
    country: 'Lesotho',
    continent: 'Africa',
    zoneAlpha3: 'LSO',
    zoneAlpha2: 'LS',
    wu: 0.0340481,
    adpe: 2.69467e-7,
    carbonFactor: 20
  },
  {
    countryName: 'Liberia',
    country: 'Liberia',
    continent: 'Africa',
    zoneAlpha3: 'LBR',
    zoneAlpha2: 'LR',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 227.84811
  },
  {
    countryName: 'Libya',
    country: 'Libya',
    continent: 'Africa',
    zoneAlpha3: 'LBY',
    zoneAlpha2: 'LY',
    wu: 0.048346,
    adpe: 2.452e-7,
    carbonFactor: 818.6922
  },
  {
    countryName: 'Lithuania',
    country: 'Lithuania',
    continent: 'Europe',
    zoneAlpha3: 'LTU',
    zoneAlpha2: 'LT',
    wu: 0.0466035,
    adpe: 9.03632e-7,
    carbonFactor: 177.18446
  },
  {
    countryName: 'Luxembourg',
    country: 'Luxembourg',
    continent: 'Europe',
    zoneAlpha3: 'LUX',
    zoneAlpha2: 'LU',
    wu: 0.0535951,
    adpe: 9.52546e-7,
    carbonFactor: 144.06781
  },
  {
    countryName: 'Macao',
    country: 'Macao',
    continent: 'Asia',
    zoneAlpha3: 'MAC',
    zoneAlpha2: 'MO',
    wu: 0.0818744,
    adpe: 7.49143e-7,
    carbonFactor: 448.97958
  },
  {
    countryName: 'Madagascar',
    country: 'Madagascar',
    continent: 'Africa',
    zoneAlpha3: 'MDG',
    zoneAlpha2: 'MG',
    wu: 0.0308434,
    adpe: 2.56895e-7,
    carbonFactor: 436.44064
  },
  {
    countryName: 'Malawi',
    country: 'Malawi',
    continent: 'Africa',
    zoneAlpha3: 'MWI',
    zoneAlpha2: 'MW',
    wu: 0.00837207,
    adpe: 6.65949e-7,
    carbonFactor: 66.66667
  },
  {
    countryName: 'Malaysia',
    country: 'Malaysia',
    continent: 'Asia',
    zoneAlpha3: 'MYS',
    zoneAlpha2: 'MY',
    wu: 0.0741895,
    adpe: 3.80615e-7,
    carbonFactor: 605.83136
  },
  {
    countryName: 'Maldives',
    country: 'Maldives',
    continent: 'Asia',
    zoneAlpha3: 'MDV',
    zoneAlpha2: 'MV',
    wu: 0.0427822,
    adpe: 4.2351e-7,
    carbonFactor: 611.7647
  },
  {
    countryName: 'Mali',
    country: 'Mali',
    continent: 'Africa',
    zoneAlpha3: 'MLI',
    zoneAlpha2: 'ML',
    wu: 0.0317986,
    adpe: 2.4158e-7,
    carbonFactor: 407.99997
  },
  {
    countryName: 'Malta',
    country: 'Malta',
    continent: 'Europe',
    zoneAlpha3: 'MLT',
    zoneAlpha2: 'MT',
    wu: 0.050018,
    adpe: 9.0462e-7,
    carbonFactor: 499.99997
  },
  {
    countryName: 'Mauritania',
    country: 'Mauritania',
    continent: 'Africa',
    zoneAlpha3: 'MRT',
    zoneAlpha2: 'MR',
    wu: 0.0370807,
    adpe: 6.83344e-7,
    carbonFactor: 464.7059
  },
  {
    countryName: 'Mauritius',
    country: 'Mauritius',
    continent: 'Africa',
    zoneAlpha3: 'MUS',
    zoneAlpha2: 'MU',
    wu: 0.075361,
    adpe: 6.12999e-7,
    carbonFactor: 632.47864
  },
  {
    countryName: 'Mexico',
    country: 'Mexico',
    continent: 'North America',
    zoneAlpha3: 'MEX',
    zoneAlpha2: 'MX',
    wu: 0.0502952,
    adpe: 7.20151e-7,
    carbonFactor: 475.3588
  },
  {
    countryName: 'Moldova',
    country: 'Moldova',
    continent: 'Europe',
    zoneAlpha3: 'MDA',
    zoneAlpha2: 'MD',
    wu: 0.0475384,
    adpe: 2.4614e-7,
    carbonFactor: 648.4963
  },
  {
    countryName: 'Mongolia',
    country: 'Mongolia',
    continent: 'Asia',
    zoneAlpha3: 'MNG',
    zoneAlpha2: 'MN',
    wu: 0.112641,
    adpe: 5.38456e-7,
    carbonFactor: 771.79486
  },
  {
    countryName: 'Montenegro',
    country: 'Montenegro',
    continent: 'Europe',
    zoneAlpha3: 'MNE',
    zoneAlpha2: 'ME',
    wu: 0.0515012,
    adpe: 3.20453e-7,
    carbonFactor: 483.3837
  },
  {
    countryName: 'Montserrat',
    country: 'Montserrat',
    continent: 'North America',
    zoneAlpha3: 'MSR',
    zoneAlpha2: 'MS',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 1000
  },
  {
    countryName: 'Morocco',
    country: 'Morocco',
    continent: 'Africa',
    zoneAlpha3: 'MAR',
    zoneAlpha2: 'MA',
    wu: 0.0872379,
    adpe: 7.74473e-7,
    carbonFactor: 662.6419
  },
  {
    countryName: 'Mozambique',
    country: 'Mozambique',
    continent: 'Africa',
    zoneAlpha3: 'MOZ',
    zoneAlpha2: 'MZ',
    wu: 0.0121267,
    adpe: 1.10639e-7,
    carbonFactor: 135.64668
  },
  {
    countryName: 'Myanmar',
    country: 'Myanmar',
    continent: 'Asia',
    zoneAlpha3: 'MMR',
    zoneAlpha2: 'MM',
    wu: 0.0330545,
    adpe: 2.71189e-7,
    carbonFactor: 483.57037
  },
  {
    countryName: 'Namibia',
    country: 'Namibia',
    continent: 'Africa',
    zoneAlpha3: 'NAM',
    zoneAlpha2: 'NA',
    wu: 0.0476091,
    adpe: 7.84457e-7,
    carbonFactor: 59.25926
  },
  {
    countryName: 'Nauru',
    country: 'Nauru',
    continent: 'Oceania',
    zoneAlpha3: 'NRU',
    zoneAlpha2: 'NR',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 750
  },
  {
    countryName: 'Nepal',
    country: 'Nepal',
    continent: 'Asia',
    zoneAlpha3: 'NPL',
    zoneAlpha2: 'NP',
    wu: 0.0195002,
    adpe: 2.6734e-7,
    carbonFactor: 24.43992
  },
  {
    countryName: 'Netherlands',
    country: 'Netherlands',
    continent: 'Europe',
    zoneAlpha3: 'NLD',
    zoneAlpha2: 'NL',
    wu: 0.0456771,
    adpe: 0.00000137225,
    carbonFactor: 324.99167
  },
  {
    countryName: 'New Caledonia',
    country: 'New Caledonia',
    continent: 'Oceania',
    zoneAlpha3: 'NCL',
    zoneAlpha2: 'NC',
    wu: 0.0729682,
    adpe: 5.34665e-7,
    carbonFactor: 660.5839
  },
  {
    countryName: 'New Zealand',
    country: 'New Zealand',
    continent: 'Oceania',
    zoneAlpha3: 'NZL',
    zoneAlpha2: 'NZ',
    wu: 0.0167544,
    adpe: 0.00000264326,
    carbonFactor: 110.88481
  },
  {
    countryName: 'Nicaragua',
    country: 'Nicaragua',
    continent: 'North America',
    zoneAlpha3: 'NIC',
    zoneAlpha2: 'NI',
    wu: 0.0394336,
    adpe: 0.00000260798,
    carbonFactor: 265.11627
  },
  {
    countryName: 'Niger',
    country: 'Niger',
    continent: 'Africa',
    zoneAlpha3: 'NER',
    zoneAlpha2: 'NE',
    wu: 0.065285,
    adpe: 5.64059e-7,
    carbonFactor: 670.88605
  },
  {
    countryName: 'Nigeria',
    country: 'Nigeria',
    continent: 'Africa',
    zoneAlpha3: 'NGA',
    zoneAlpha2: 'NG',
    wu: 0.0383377,
    adpe: 1.98425e-7,
    carbonFactor: 516.225
  },
  {
    countryName: 'North Korea',
    country: 'North Korea',
    continent: 'Asia',
    zoneAlpha3: 'PRK',
    zoneAlpha2: 'KP',
    wu: 0.0637298,
    adpe: 3.09677e-7,
    carbonFactor: 389.58707
  },
  {
    countryName: 'North Macedonia',
    country: 'North Macedonia',
    continent: 'Europe',
    zoneAlpha3: 'MKD',
    zoneAlpha2: 'MK',
    wu: 0.0643911,
    adpe: 5.79588e-7,
    carbonFactor: 639.86017
  },
  {
    countryName: 'Norway',
    country: 'Norway',
    continent: 'Europe',
    zoneAlpha3: 'NOR',
    zoneAlpha2: 'NO',
    wu: 0.00323597,
    adpe: 1.61092e-7,
    carbonFactor: 29.484032
  },
  {
    countryName: 'Oman',
    country: 'Oman',
    continent: 'Asia',
    zoneAlpha3: 'OMN',
    zoneAlpha2: 'OM',
    wu: 0.0502,
    adpe: 2.43e-7,
    carbonFactor: 564.6922
  },
  {
    countryName: 'Pakistan',
    country: 'Pakistan',
    continent: 'Asia',
    zoneAlpha3: 'PAK',
    zoneAlpha2: 'PK',
    wu: 0.0608651,
    adpe: 3.13226e-7,
    carbonFactor: 463.6563
  },
  {
    countryName: 'Palestine',
    country: 'Palestine',
    continent: 'Asia',
    zoneAlpha3: 'PSE',
    zoneAlpha2: 'PS',
    wu: 0.0476731,
    adpe: 3.66497e-7,
    carbonFactor: 516.129
  },
  {
    countryName: 'Panama',
    country: 'Panama',
    continent: 'North America',
    zoneAlpha3: 'PAN',
    zoneAlpha2: 'PA',
    wu: 0.031479,
    adpe: 3.45081e-7,
    carbonFactor: 161.67665
  },
  {
    countryName: 'Papua New Guinea',
    country: 'Papua New Guinea',
    continent: 'Oceania',
    zoneAlpha3: 'PNG',
    zoneAlpha2: 'PG',
    wu: 0.0360566,
    adpe: 0.00000148131,
    carbonFactor: 507.24634
  },
  {
    countryName: 'Paraguay',
    country: 'Paraguay',
    continent: 'South America',
    zoneAlpha3: 'PRY',
    zoneAlpha2: 'PY',
    wu: 0.00188047,
    adpe: 6.24463e-8,
    carbonFactor: 24.31266
  },
  {
    countryName: 'Peru',
    country: 'Peru',
    continent: 'South America',
    zoneAlpha3: 'PER',
    zoneAlpha2: 'PE',
    wu: 0.0249632,
    adpe: 2.60889e-7,
    carbonFactor: 251.73491
  },
  {
    countryName: 'Philippines',
    country: 'Philippines',
    continent: 'Asia',
    zoneAlpha3: 'PHL',
    zoneAlpha2: 'PH',
    wu: 0.0886322,
    adpe: 0.0000018098,
    carbonFactor: 601.0972
  },
  {
    countryName: 'Poland',
    country: 'Poland',
    continent: 'Europe',
    zoneAlpha3: 'POL',
    zoneAlpha2: 'PL',
    wu: 0.087117,
    adpe: 9.42893e-7,
    carbonFactor: 733.18396
  },
  {
    countryName: 'Portugal',
    country: 'Portugal',
    continent: 'Europe',
    zoneAlpha3: 'PRT',
    zoneAlpha2: 'PT',
    wu: 0.0318181,
    adpe: 8.44128e-7,
    carbonFactor: 225.1941
  },
  {
    countryName: 'Puerto Rico',
    country: 'Puerto Rico',
    continent: 'North America',
    zoneAlpha3: 'PRI',
    zoneAlpha2: 'PR',
    wu: 0.0583184,
    adpe: 3.54159e-7,
    carbonFactor: 678.7377
  },
  {
    countryName: 'Qatar',
    country: 'Qatar',
    continent: 'Asia',
    zoneAlpha3: 'QAT',
    zoneAlpha2: 'QA',
    wu: 0.0502,
    adpe: 2.43e-7,
    carbonFactor: 602.59015
  },
  {
    countryName: 'Romania',
    country: 'Romania',
    continent: 'Europe',
    zoneAlpha3: 'ROU',
    zoneAlpha2: 'RO',
    wu: 0.0550861,
    adpe: 4.40306e-7,
    carbonFactor: 297.93457
  },
  {
    countryName: 'Russia',
    country: 'Russia',
    continent: 'Europe',
    zoneAlpha3: 'RUS',
    zoneAlpha2: 'RU',
    wu: 0.0689804,
    adpe: 2.86825e-7,
    carbonFactor: 436.2778
  },
  {
    countryName: 'Rwanda',
    country: 'Rwanda',
    continent: 'Africa',
    zoneAlpha3: 'RWA',
    zoneAlpha2: 'RW',
    wu: 0.0301048,
    adpe: 2.95791e-7,
    carbonFactor: 316.32654
  },
  {
    countryName: 'Saint Helena',
    country: 'Saint Helena',
    continent: 'Africa',
    zoneAlpha3: 'SHN',
    zoneAlpha2: 'SH',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 1000
  },
  {
    countryName: 'Saint Kitts and Nevis',
    country: 'Saint Kitts and Nevis',
    continent: 'North America',
    zoneAlpha3: 'KNA',
    zoneAlpha2: 'KN',
    wu: 0.0419349,
    adpe: 2.49357e-7,
    carbonFactor: 636.36365
  },
  {
    countryName: 'Saint Lucia',
    country: 'Saint Lucia',
    continent: 'North America',
    zoneAlpha3: 'LCA',
    zoneAlpha2: 'LC',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 666.6666
  },
  {
    countryName: 'Saint Pierre and Miquelon',
    country: 'Saint Pierre and Miquelon',
    continent: 'North America',
    zoneAlpha3: 'SPM',
    zoneAlpha2: 'PM',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 600
  },
  {
    countryName: 'Saint Vincent and the Grenadines',
    country: 'Saint Vincent and the Grenadines',
    continent: 'North America',
    zoneAlpha3: 'VCT',
    zoneAlpha2: 'VC',
    wu: 0.0379227,
    adpe: 2.07419e-7,
    carbonFactor: 529.4118
  },
  {
    countryName: 'Samoa',
    country: 'Samoa',
    continent: 'Oceania',
    zoneAlpha3: 'WSM',
    zoneAlpha2: 'WS',
    wu: 0.030615,
    adpe: 8.414e-7,
    carbonFactor: 473.68423
  },
  {
    countryName: 'Sao Tome and Principe',
    country: 'Sao Tome and Principe',
    continent: 'Africa',
    zoneAlpha3: 'STP',
    zoneAlpha2: 'ST',
    wu: 0.0396967,
    adpe: 2.14602e-7,
    carbonFactor: 642.8572
  },
  {
    countryName: 'Saudi Arabia',
    country: 'Saudi Arabia',
    continent: 'Asia',
    zoneAlpha3: 'SAU',
    zoneAlpha2: 'SA',
    wu: 0.0474456,
    adpe: 2.40849e-7,
    carbonFactor: 706.7905
  },
  {
    countryName: 'Senegal',
    country: 'Senegal',
    continent: 'Africa',
    zoneAlpha3: 'SEN',
    zoneAlpha2: 'SN',
    wu: 0.0519254,
    adpe: 5.62312e-7,
    carbonFactor: 511.59793
  },
  {
    countryName: 'Serbia',
    country: 'Serbia',
    continent: 'Europe',
    zoneAlpha3: 'SRB',
    zoneAlpha2: 'RS',
    wu: 0.0765611,
    adpe: 3.68005e-7,
    carbonFactor: 695.6884
  },
  {
    countryName: 'Seychelles',
    country: 'Seychelles',
    continent: 'Africa',
    zoneAlpha3: 'SYC',
    zoneAlpha2: 'SC',
    wu: 0.0421381,
    adpe: 5.97146e-7,
    carbonFactor: 564.5161
  },
  {
    countryName: 'Sierra Leone',
    country: 'Sierra Leone',
    continent: 'Africa',
    zoneAlpha3: 'SLE',
    zoneAlpha2: 'SL',
    wu: 0.004874,
    adpe: 3.3904e-7,
    carbonFactor: 50
  },
  {
    countryName: 'Singapore',
    country: 'Singapore',
    continent: 'Asia',
    zoneAlpha3: 'SGP',
    zoneAlpha2: 'SG',
    wu: 0.0496795,
    adpe: 3.28997e-7,
    carbonFactor: 473.9986
  },
  {
    countryName: 'Slovakia',
    country: 'Slovakia',
    continent: 'Europe',
    zoneAlpha3: 'SVK',
    zoneAlpha2: 'SK',
    wu: 0.095705,
    adpe: 5.8065e-7,
    carbonFactor: 142.04973
  },
  {
    countryName: 'Slovenia',
    country: 'Slovenia',
    continent: 'Europe',
    zoneAlpha3: 'SVN',
    zoneAlpha2: 'SI',
    wu: 0.0782553,
    adpe: 3.97242e-7,
    carbonFactor: 257.48505
  },
  {
    countryName: 'Solomon Islands',
    country: 'Solomon Islands',
    continent: 'Oceania',
    zoneAlpha3: 'SLB',
    zoneAlpha2: 'SB',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 700
  },
  {
    countryName: 'Somalia',
    country: 'Somalia',
    continent: 'Africa',
    zoneAlpha3: 'SOM',
    zoneAlpha2: 'SO',
    wu: 0.0420004,
    adpe: 3.83202e-7,
    carbonFactor: 578.9473
  },
  {
    countryName: 'South Africa',
    country: 'South Africa',
    continent: 'Africa',
    zoneAlpha3: 'ZAF',
    zoneAlpha2: 'ZA',
    wu: 0.10729,
    adpe: 8.74399e-7,
    carbonFactor: 729.67194
  },
  {
    countryName: 'South Korea',
    country: 'South Korea',
    continent: 'Asia',
    zoneAlpha3: 'KOR',
    zoneAlpha2: 'KR',
    wu: 0.0968165,
    adpe: 7.94357e-7,
    carbonFactor: 441.6483
  },
  {
    countryName: 'South Sudan',
    country: 'South Sudan',
    continent: 'Africa',
    zoneAlpha3: 'SSD',
    zoneAlpha2: 'SS',
    wu: 0.0431527,
    adpe: 3.23617e-7,
    carbonFactor: 629.0322
  },
  {
    countryName: 'Spain',
    country: 'Spain',
    continent: 'Europe',
    zoneAlpha3: 'ESP',
    zoneAlpha2: 'ES',
    wu: 0.0498265,
    adpe: 0.00000126246,
    carbonFactor: 217.76645
  },
  {
    countryName: 'Sri Lanka',
    country: 'Sri Lanka',
    continent: 'Asia',
    zoneAlpha3: 'LKA',
    zoneAlpha2: 'LK',
    wu: 0.0566859,
    adpe: 3.92644e-7,
    carbonFactor: 509.78134
  },
  {
    countryName: 'Sudan',
    country: 'Sudan',
    continent: 'Africa',
    zoneAlpha3: 'SDN',
    zoneAlpha2: 'SD',
    wu: 0.0179856,
    adpe: 1.37187e-7,
    carbonFactor: 263.15787
  },
  {
    countryName: 'Suriname',
    country: 'Suriname',
    continent: 'South America',
    zoneAlpha3: 'SUR',
    zoneAlpha2: 'SR',
    wu: 0.0224054,
    adpe: 1.74377e-7,
    carbonFactor: 349.28232
  },
  {
    countryName: 'Sweden',
    country: 'Sweden',
    continent: 'Europe',
    zoneAlpha3: 'SWE',
    zoneAlpha2: 'SE',
    wu: 0.0456833,
    adpe: 3.53283e-7,
    carbonFactor: 41.067406
  },
  {
    countryName: 'Switzerland',
    country: 'Switzerland',
    continent: 'Europe',
    zoneAlpha3: 'CHE',
    zoneAlpha2: 'CH',
    wu: 0.0481541,
    adpe: 4.40092e-7,
    carbonFactor: 36.13297
  },
  {
    countryName: 'Syria',
    country: 'Syria',
    continent: 'Asia',
    zoneAlpha3: 'SYR',
    zoneAlpha2: 'SY',
    wu: 0.045607,
    adpe: 2.31059e-7,
    carbonFactor: 701.6607
  },
  {
    countryName: 'Taiwan',
    country: 'Taiwan',
    continent: 'Asia',
    zoneAlpha3: 'TWN',
    zoneAlpha2: 'TW',
    wu: 0.0847108,
    adpe: 6.15476e-7,
    carbonFactor: 639.528
  },
  {
    countryName: 'Tajikistan',
    country: 'Tajikistan',
    continent: 'Asia',
    zoneAlpha3: 'TJK',
    zoneAlpha2: 'TJ',
    wu: 0.010945,
    adpe: 9.60862e-8,
    carbonFactor: 116.85825
  },
  {
    countryName: 'Tanzania',
    country: 'Tanzania',
    continent: 'Africa',
    zoneAlpha3: 'TZA',
    zoneAlpha2: 'TZ',
    wu: 0.0352028,
    adpe: 2.19064e-7,
    carbonFactor: 339.2461
  },
  {
    countryName: 'Thailand',
    country: 'Thailand',
    continent: 'Asia',
    zoneAlpha3: 'THA',
    zoneAlpha2: 'TH',
    wu: 0.0642864,
    adpe: 5.14875e-7,
    carbonFactor: 560.7429
  },
  {
    countryName: 'Togo',
    country: 'Togo',
    continent: 'Africa',
    zoneAlpha3: 'TGO',
    zoneAlpha2: 'TG',
    wu: 0.0499308,
    adpe: 3.65815e-7,
    carbonFactor: 443.1818
  },
  {
    countryName: 'Tonga',
    country: 'Tonga',
    continent: 'Oceania',
    zoneAlpha3: 'TON',
    zoneAlpha2: 'TO',
    wu: 0.0407277,
    adpe: 9.77367e-7,
    carbonFactor: 625
  },
  {
    countryName: 'Trinidad and Tobago',
    country: 'Trinidad and Tobago',
    continent: 'North America',
    zoneAlpha3: 'TTO',
    zoneAlpha2: 'TT',
    wu: 0.0501425,
    adpe: 2.48683e-7,
    carbonFactor: 681.5286
  },
  {
    countryName: 'Tunisia',
    country: 'Tunisia',
    continent: 'Africa',
    zoneAlpha3: 'TUN',
    zoneAlpha2: 'TN',
    wu: 0.0494612,
    adpe: 2.50478e-7,
    carbonFactor: 564.6226
  },
  {
    countryName: 'Turkey',
    country: 'Turkey',
    continent: 'Europe',
    zoneAlpha3: 'TUR',
    zoneAlpha2: 'TR',
    wu: 0.0616141,
    adpe: 0.00000110597,
    carbonFactor: 459.10278
  },
  {
    countryName: 'Turkmenistan',
    country: 'Turkmenistan',
    continent: 'Asia',
    zoneAlpha3: 'TKM',
    zoneAlpha2: 'TM',
    wu: 0.0502,
    adpe: 2.43e-7,
    carbonFactor: 1306.0251
  },
  {
    countryName: 'Turks and Caicos Islands',
    country: 'Turks and Caicos Islands',
    continent: 'North America',
    zoneAlpha3: 'TCA',
    zoneAlpha2: 'TC',
    wu: 0.0435,
    adpe: 2.3e-7,
    carbonFactor: 653.8462
  },
  {
    countryName: 'Uganda',
    country: 'Uganda',
    continent: 'Africa',
    zoneAlpha3: 'UGA',
    zoneAlpha2: 'UG',
    wu: 0.00778789,
    adpe: 2.46415e-7,
    carbonFactor: 44.526905
  },
  {
    countryName: 'Ukraine',
    country: 'Ukraine',
    continent: 'Europe',
    zoneAlpha3: 'UKR',
    zoneAlpha2: 'UA',
    wu: 0.11031,
    adpe: 3.86426e-7,
    carbonFactor: 259.69302
  },
  {
    countryName: 'United Arab Emirates',
    country: 'United Arab Emirates',
    continent: 'Asia',
    zoneAlpha3: 'ARE',
    zoneAlpha2: 'AE',
    wu: 0.049511,
    adpe: 3.80729e-7,
    carbonFactor: 561.1348
  },
  {
    countryName: 'United Kingdom',
    country: 'United Kingdom',
    continent: 'Europe',
    zoneAlpha3: 'GBR',
    zoneAlpha2: 'GB',
    wu: 0.0505953,
    adpe: 7.00514e-7,
    carbonFactor: 255.84961
  },
  {
    countryName: 'United States',
    country: 'United States',
    continent: 'North America',
    zoneAlpha3: 'USA',
    zoneAlpha2: 'US',
    wu: 0.0682978,
    adpe: 6.95918e-7,
    carbonFactor: 385.97964
  },
  {
    countryName: 'United States Virgin Islands',
    country: 'United States Virgin Islands',
    continent: 'North America',
    zoneAlpha3: 'VIR',
    zoneAlpha2: 'VI',
    wu: 0.0432051,
    adpe: 3.09496e-7,
    carbonFactor: 632.35297
  },
  {
    countryName: 'Uruguay',
    country: 'Uruguay',
    continent: 'South America',
    zoneAlpha3: 'URY',
    zoneAlpha2: 'UY',
    wu: 0.0186004,
    adpe: 6.15899e-7,
    carbonFactor: 112.648224
  },
  {
    countryName: 'Uzbekistan',
    country: 'Uzbekistan',
    continent: 'Asia',
    zoneAlpha3: 'UZB',
    zoneAlpha2: 'UZ',
    wu: 0.0486564,
    adpe: 2.47489e-7,
    carbonFactor: 1167.6029
  },
  {
    countryName: 'Vanuatu',
    country: 'Vanuatu',
    continent: 'Oceania',
    zoneAlpha3: 'VUT',
    zoneAlpha2: 'VU',
    wu: 0.0407277,
    adpe: 9.77367e-7,
    carbonFactor: 571.4286
  },
  {
    countryName: 'Venezuela',
    country: 'Venezuela',
    continent: 'South America',
    zoneAlpha3: 'VEN',
    zoneAlpha2: 'VE',
    wu: 0.0207542,
    adpe: 1.3556e-7,
    carbonFactor: 185.80202
  },
  {
    countryName: 'Vietnam',
    country: 'Vietnam',
    continent: 'Asia',
    zoneAlpha3: 'VNM',
    zoneAlpha2: 'VN',
    wu: 0.0649781,
    adpe: 8.39294e-7,
    carbonFactor: 409.80072
  },
  {
    countryName: 'World',
    country: 'World',
    continent: 'World',
    zoneAlpha3: 'OWID_WRL',
    zoneAlpha2: 'OWID_WRL',
    wu: undefined,
    adpe: undefined,
    carbonFactor: 485.99475
  },
  {
    countryName: 'Yemen',
    country: 'Yemen',
    continent: 'Asia',
    zoneAlpha3: 'YEM',
    zoneAlpha2: 'YE',
    wu: 0.0413157,
    adpe: 9.96418e-7,
    carbonFactor: 566.1016
  },
  {
    countryName: 'Zambia',
    country: 'Zambia',
    continent: 'Africa',
    zoneAlpha3: 'ZMB',
    zoneAlpha2: 'ZM',
    wu: 0.0176485,
    adpe: 1.67135e-7,
    carbonFactor: 111.96713
  },
  {
    countryName: 'Zimbabwe',
    country: 'Zimbabwe',
    continent: 'Africa',
    zoneAlpha3: 'ZWE',
    zoneAlpha2: 'ZW',
    wu: 0.0619069,
    adpe: 3.33677e-7,
    carbonFactor: 297.87234
  }
];
