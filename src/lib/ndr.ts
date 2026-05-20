const PAGE_ID = 'mw2605';
const NDRU3 = '';
const NDRL3 = '';
const PV_PAGE_URL   = 'm_ndr.nate.com/m_shortform/dramapann';
const PV_MODAL_URL  = 'm_ndr.nate.com/m_shortform/f_dramapann';

export const NDR = {
  PLAYER_TAP:     'STD01',
  HEART:          'STD02',
  MUTE:           'STD03',
  EPISODE_LIST:   'STD04',
  TAB_EPISODES:   'STD05',
  EP_AVAILABLE:   'STD06',
  EP_UNAVAILABLE: 'STD07',
  TAB_OTHER:      'STD08',
  SWIPE_PREV:     'STD09',
  SWIPE_NEXT:     'STD10',
  OTHER_CONTENT:       'STD11',
  MODAL_PV:            'STD12',
  OTHER_SERIES_CLICK:  'STD081',
} as const;

export function vndrCall(regionId: string) {
  const src =
    `https://statclick.nate.com/stat/statclick.tiff?cp_url=[click_ndr.nate.com/??` +
    `ndrpageid=${PAGE_ID}&ndrregionid=${regionId}&ndru3=${NDRU3}&ndrl3=${NDRL3}]` +
    `${new Date().getTime()}`;
  const img = new Image();
  img.src = src;
}

function firePV(virtualUrl: string) {
  const dummy = new Date().getTime();
  const src = `https://stat.nate.com/stat/mstat.tiff?cp_url=[${virtualUrl}]t=${dummy}`;
  const img = new Image();
  img.src = src;
}

export function firePagePV()  { firePV(PV_PAGE_URL); }
export function fireModalPV() { firePV(PV_MODAL_URL); }
