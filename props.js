(function(root){'use strict';
 const themes={
  "library": {
    "id": "library",
    "name": "雨夜书库",
    "levels": [
      1
    ],
    "palette": "ink blue, book red, dark walnut, parchment",
    "props": {
      "chair": "library-chair",
      "rug": "library-rug",
      "table": "library-table",
      "plant": "library-plant"
    }
  },
  "tea": {
    "id": "tea",
    "name": "槐雨茶馆",
    "levels": [
      2,
      24
    ],
    "palette": "jade green, bamboo tan, clay orange, muted cream",
    "props": {
      "chair": "tea-chair",
      "rug": "tea-rug",
      "table": "tea-table",
      "plant": "tea-plant"
    }
  },
  "manor": {
    "id": "manor",
    "name": "烛光宅邸",
    "levels": [
      3,
      13
    ],
    "palette": "wine red, antique gold, dark brown, candle cream",
    "props": {
      "chair": "manor-chair",
      "rug": "manor-rug",
      "table": "manor-table",
      "plant": "manor-plant"
    }
  },
  "garden": {
    "id": "garden",
    "name": "池畔花园",
    "levels": [
      4
    ],
    "palette": "leaf green, cool gray stone, warm ochre, soft sky blue",
    "props": {
      "chair": "garden-chair",
      "rug": "garden-rug",
      "table": "garden-table",
      "plant": "garden-plant"
    }
  },
  "station": {
    "id": "station",
    "name": "暮灯车站",
    "levels": [
      5,
      10,
      21
    ],
    "palette": "railway teal, amber, iron gray, luggage brown",
    "props": {
      "chair": "station-chair",
      "rug": "station-rug",
      "table": "station-table",
      "plant": "station-plant"
    }
  },
  "greenhouse": {
    "id": "greenhouse",
    "name": "雾汽温室",
    "levels": [
      6,
      18
    ],
    "palette": "sage green, cyan glass, pale wood, rich soil brown",
    "props": {
      "chair": "greenhouse-chair",
      "rug": "greenhouse-rug",
      "table": "greenhouse-table",
      "plant": "greenhouse-plant"
    }
  },
  "music": {
    "id": "music",
    "name": "旧声唱片室",
    "levels": [
      7,
      27
    ],
    "palette": "burgundy, near-black brown, brass yellow, dusty cream",
    "props": {
      "chair": "music-chair",
      "rug": "music-rug",
      "table": "music-table",
      "plant": "music-plant"
    }
  },
  "harbor": {
    "id": "harbor",
    "name": "雾港渡口",
    "levels": [
      8,
      17
    ],
    "palette": "sea teal, navy, rope beige, weathered wood, rusty red",
    "props": {
      "chair": "harbor-chair",
      "rug": "harbor-rug",
      "table": "harbor-table",
      "plant": "harbor-plant"
    }
  },
  "clock": {
    "id": "clock",
    "name": "铜齿钟楼",
    "levels": [
      9,
      19
    ],
    "palette": "antique brass, midnight blue, walnut brown, clockface cream",
    "props": {
      "chair": "clock-chair",
      "rug": "clock-rug",
      "table": "clock-table",
      "plant": "clock-plant"
    }
  },
  "post": {
    "id": "post",
    "name": "晨雾邮局",
    "levels": [
      11,
      26,
      30
    ],
    "palette": "postal red, canvas beige, blue-gray, dark walnut",
    "props": {
      "chair": "post-chair",
      "rug": "post-rug",
      "table": "post-table",
      "plant": "post-plant"
    }
  },
  "photo": {
    "id": "photo",
    "name": "红灯照相馆",
    "levels": [
      12
    ],
    "palette": "charcoal black, dark plum, red safelight, pale silver",
    "props": {
      "chair": "photo-chair",
      "rug": "photo-rug",
      "table": "photo-table",
      "plant": "photo-plant"
    }
  },
  "workshop": {
    "id": "workshop",
    "name": "晚灯工坊",
    "levels": [
      14,
      25
    ],
    "palette": "tool steel gray, workwear orange, walnut brown, deep blue",
    "props": {
      "chair": "workshop-chair",
      "rug": "workshop-rug",
      "table": "workshop-table",
      "plant": "workshop-plant"
    }
  },
  "archive": {
    "id": "archive",
    "name": "旧账档案馆",
    "levels": [
      15,
      22,
      28,
      29
    ],
    "palette": "dusty teal, paper cream, dark walnut, sealing-wax red",
    "props": {
      "chair": "archive-chair",
      "rug": "archive-rug",
      "table": "archive-table",
      "plant": "archive-plant"
    }
  },
  "theater": {
    "id": "theater",
    "name": "落幕剧院",
    "levels": [
      23
    ],
    "palette": "stage scarlet, antique gold, near-black purple, warm wood",
    "props": {
      "chair": "theater-chair",
      "rug": "theater-rug",
      "table": "theater-table",
      "plant": "theater-plant"
    }
  },
  "gallery": {
    "id": "gallery",
    "name": "静夜美术馆",
    "levels": [
      20
    ],
    "palette": "gallery ivory, muted rose, dark mahogany, bronze green",
    "props": {
      "chair": "gallery-chair",
      "rug": "gallery-rug",
      "table": "gallery-table",
      "plant": "gallery-plant"
    }
  },
  "lighthouse": {
    "id": "lighthouse",
    "name": "长夜灯塔",
    "levels": [
      16
    ],
    "palette": "chalk white, navy blue, beacon amber, sea green",
    "props": {
      "chair": "lighthouse-chair",
      "rug": "lighthouse-rug",
      "table": "lighthouse-table",
      "plant": "lighthouse-plant"
    }
  }
},props={
  "library-chair": {
    "id": "library-chair",
    "name": "阅览椅",
    "description": "a walnut reading chair with a dark red cushion",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/library-chair.png",
    "theme": "library"
  },
  "library-rug": {
    "id": "library-rug",
    "name": "书纹毯",
    "description": "a flat indigo square floor rug with a simple open-book emblem",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/library-rug.png",
    "theme": "library"
  },
  "library-table": {
    "id": "library-table",
    "name": "书架",
    "description": "a short dark walnut bookcase with two rows of colorful books",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/library-table.png",
    "theme": "library"
  },
  "library-plant": {
    "id": "library-plant",
    "name": "阅读灯",
    "description": "a squat green brass reading lamp with a broad green shade",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/library-plant.png",
    "theme": "library"
  },
  "tea-chair": {
    "id": "tea-chair",
    "name": "蒲团",
    "description": "a round woven straw sitting cushion with a jade center",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/tea-chair.png",
    "theme": "tea"
  },
  "tea-rug": {
    "id": "tea-rug",
    "name": "竹席",
    "description": "a flat rectangular pale bamboo floor mat with green binding",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/tea-rug.png",
    "theme": "tea"
  },
  "tea-table": {
    "id": "tea-table",
    "name": "茶案",
    "description": "a low dark tea table with one little teapot and a cup",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/tea-table.png",
    "theme": "tea"
  },
  "tea-plant": {
    "id": "tea-plant",
    "name": "茶炉",
    "description": "a small terracotta charcoal tea stove with a brass kettle",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/tea-plant.png",
    "theme": "tea"
  },
  "manor-chair": {
    "id": "manor-chair",
    "name": "绒椅",
    "description": "a high-backed antique armchair upholstered in wine-red velvet",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/manor-chair.png",
    "theme": "manor"
  },
  "manor-rug": {
    "id": "manor-rug",
    "name": "绣毯",
    "description": "a flat red square Persian carpet with a simple gold diamond",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/manor-rug.png",
    "theme": "manor"
  },
  "manor-table": {
    "id": "manor-table",
    "name": "画架",
    "description": "a wooden easel holding a small gold-framed landscape painting",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/manor-table.png",
    "theme": "manor"
  },
  "manor-plant": {
    "id": "manor-plant",
    "name": "烛台",
    "description": "a low brass three-branch candelabrum with three chunky cream candles",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/manor-plant.png",
    "theme": "manor"
  },
  "garden-chair": {
    "id": "garden-chair",
    "name": "园椅",
    "description": "a short green wooden garden bench for one visitor",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/garden-chair.png",
    "theme": "garden"
  },
  "garden-rug": {
    "id": "garden-rug",
    "name": "石板",
    "description": "a flat irregular gray stepping stone with a few moss pixels",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/garden-rug.png",
    "theme": "garden"
  },
  "garden-table": {
    "id": "garden-table",
    "name": "喷泉",
    "description": "a small round gray stone fountain with a simple blue water spout",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/garden-table.png",
    "theme": "garden"
  },
  "garden-plant": {
    "id": "garden-plant",
    "name": "果树",
    "description": "a compact little orange tree with three orange fruits in a stone tub",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/garden-plant.png",
    "theme": "garden"
  },
  "station-chair": {
    "id": "station-chair",
    "name": "候车椅",
    "description": "a compact teal cast-iron waiting-room bench for one visitor",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/station-chair.png",
    "theme": "station"
  },
  "station-rug": {
    "id": "station-rug",
    "name": "站台板",
    "description": "a flat gray boarding plate with two broad yellow safety stripes",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/station-rug.png",
    "theme": "station"
  },
  "station-table": {
    "id": "station-table",
    "name": "行李箱",
    "description": "two stacked brown vintage travel trunks with brass corner caps",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/station-table.png",
    "theme": "station"
  },
  "station-plant": {
    "id": "station-plant",
    "name": "信号灯",
    "description": "a compact upright dark railway signal lamp with a large amber light",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/station-plant.png",
    "theme": "station"
  },
  "greenhouse-chair": {
    "id": "greenhouse-chair",
    "name": "矮凳",
    "description": "a little pale-wood gardening stool with a round moss-green seat",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/greenhouse-chair.png",
    "theme": "greenhouse"
  },
  "greenhouse-rug": {
    "id": "greenhouse-rug",
    "name": "木踏板",
    "description": "a flat pale wooden slatted stepping board with tiny green moss pixels",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/greenhouse-rug.png",
    "theme": "greenhouse"
  },
  "greenhouse-table": {
    "id": "greenhouse-table",
    "name": "育苗架",
    "description": "a low two-shelf pale wooden seedling rack with four tiny green sprouts",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/greenhouse-table.png",
    "theme": "greenhouse"
  },
  "greenhouse-plant": {
    "id": "greenhouse-plant",
    "name": "水壶",
    "description": "a chunky turquoise watering can with a curved handle and long spout",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/greenhouse-plant.png",
    "theme": "greenhouse"
  },
  "music-chair": {
    "id": "music-chair",
    "name": "琴凳",
    "description": "a small burgundy upholstered piano stool with dark wooden legs",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/music-chair.png",
    "theme": "music"
  },
  "music-rug": {
    "id": "music-rug",
    "name": "唱片毯",
    "description": "a flat round dark vinyl-record-pattern floor rug with a red center",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/music-rug.png",
    "theme": "music"
  },
  "music-table": {
    "id": "music-table",
    "name": "留声机",
    "description": "a compact antique gramophone with an oversized brass horn and walnut base",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/music-table.png",
    "theme": "music"
  },
  "music-plant": {
    "id": "music-plant",
    "name": "唱片柜",
    "description": "a small walnut record cabinet with visible colored upright record sleeves",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/music-plant.png",
    "theme": "music"
  },
  "harbor-chair": {
    "id": "harbor-chair",
    "name": "船凳",
    "description": "a low weathered wood sailor stool with a navy-blue seat",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/harbor-chair.png",
    "theme": "harbor"
  },
  "harbor-rug": {
    "id": "harbor-rug",
    "name": "栈板",
    "description": "a flat square dock plank panel with two chunky rope knots",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/harbor-rug.png",
    "theme": "harbor"
  },
  "harbor-table": {
    "id": "harbor-table",
    "name": "缆柱",
    "description": "a short rusty iron mooring bollard wrapped in a thick beige rope",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/harbor-table.png",
    "theme": "harbor"
  },
  "harbor-plant": {
    "id": "harbor-plant",
    "name": "航灯",
    "description": "a squat brass maritime lantern with teal glass and an orange glow",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/harbor-plant.png",
    "theme": "harbor"
  },
  "clock-chair": {
    "id": "clock-chair",
    "name": "钟匠凳",
    "description": "a small round dark-blue leather clockmaker stool with three brass legs",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/clock-chair.png",
    "theme": "clock"
  },
  "clock-rug": {
    "id": "clock-rug",
    "name": "齿纹垫",
    "description": "a flat dark-blue square floor mat with a simple broad brass gear emblem",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/clock-rug.png",
    "theme": "clock"
  },
  "clock-table": {
    "id": "clock-table",
    "name": "座钟",
    "description": "a squat walnut mantel clock with a large ivory circular clock face",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/clock-table.png",
    "theme": "clock"
  },
  "clock-plant": {
    "id": "clock-plant",
    "name": "齿轮台",
    "description": "a small brass-edged repair table holding two oversized brass gears",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/clock-plant.png",
    "theme": "clock"
  },
  "post-chair": {
    "id": "post-chair",
    "name": "邮凳",
    "description": "a sturdy postal-red wood sorting stool with a square cream seat",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/post-chair.png",
    "theme": "post"
  },
  "post-rug": {
    "id": "post-rug",
    "name": "邮袋垫",
    "description": "a flat beige woven canvas floor mat with a broad red envelope emblem",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/post-rug.png",
    "theme": "post"
  },
  "post-table": {
    "id": "post-table",
    "name": "邮筒",
    "description": "a compact bright postal-red standing mailbox with a black mail slot",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/post-table.png",
    "theme": "post"
  },
  "post-plant": {
    "id": "post-plant",
    "name": "信架",
    "description": "a short dark wooden pigeonhole rack filled with chunky cream envelopes",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/post-plant.png",
    "theme": "post"
  },
  "photo-chair": {
    "id": "photo-chair",
    "name": "影棚凳",
    "description": "a short black photographer stool with a plum-red padded seat",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/photo-chair.png",
    "theme": "photo"
  },
  "photo-rug": {
    "id": "photo-rug",
    "name": "定位垫",
    "description": "a flat dark plum round studio floor mat with a broad cream cross mark",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/photo-rug.png",
    "theme": "photo"
  },
  "photo-table": {
    "id": "photo-table",
    "name": "相机",
    "description": "a vintage black bellows box camera with a silver lens on a sturdy tripod",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/photo-table.png",
    "theme": "photo"
  },
  "photo-plant": {
    "id": "photo-plant",
    "name": "放大机",
    "description": "a compact darkroom enlarger with a square black head on a silver support and a red tray",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/photo-plant.png",
    "theme": "photo"
  },
  "workshop-chair": {
    "id": "workshop-chair",
    "name": "工匠凳",
    "description": "a low rugged brown leather workshop stool with steel legs",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/workshop-chair.png",
    "theme": "workshop"
  },
  "workshop-rug": {
    "id": "workshop-rug",
    "name": "防滑垫",
    "description": "a flat deep-blue square rubber mat with broad orange corner blocks",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/workshop-rug.png",
    "theme": "workshop"
  },
  "workshop-table": {
    "id": "workshop-table",
    "name": "工具台",
    "description": "a chunky wooden workbench with an orange vise and one broad steel wrench",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/workshop-table.png",
    "theme": "workshop"
  },
  "workshop-plant": {
    "id": "workshop-plant",
    "name": "零件柜",
    "description": "a compact blue-gray drawer cabinet with four large orange-handled drawers",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/workshop-plant.png",
    "theme": "workshop"
  },
  "archive-chair": {
    "id": "archive-chair",
    "name": "阅卷椅",
    "description": "a simple dark walnut office chair with a dusty-teal upholstered seat",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/archive-chair.png",
    "theme": "archive"
  },
  "archive-rug": {
    "id": "archive-rug",
    "name": "档案垫",
    "description": "a flat dusty-teal square floor mat with a broad cream file-folder emblem",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/archive-rug.png",
    "theme": "archive"
  },
  "archive-table": {
    "id": "archive-table",
    "name": "卷柜",
    "description": "a short teal filing cabinet with four cream label drawers",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/archive-table.png",
    "theme": "archive"
  },
  "archive-plant": {
    "id": "archive-plant",
    "name": "印章台",
    "description": "a small dark walnut stamp desk with a large red seal and a cream ledger",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/archive-plant.png",
    "theme": "archive"
  },
  "theater-chair": {
    "id": "theater-chair",
    "name": "观众椅",
    "description": "a compact scarlet padded theater seat with gold armrests",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/theater-chair.png",
    "theme": "theater"
  },
  "theater-rug": {
    "id": "theater-rug",
    "name": "舞台板",
    "description": "a flat wooden stage tile with a broad gold star inset",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/theater-rug.png",
    "theme": "theater"
  },
  "theater-table": {
    "id": "theater-table",
    "name": "聚光灯",
    "description": "a large chunky dark stage spotlight on a low iron stand with a warm gold lens",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/theater-table.png",
    "theme": "theater"
  },
  "theater-plant": {
    "id": "theater-plant",
    "name": "道具箱",
    "description": "a short dark purple theater prop chest with a cream comedy mask and red cloth",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/theater-plant.png",
    "theme": "theater"
  },
  "gallery-chair": {
    "id": "gallery-chair",
    "name": "展厅凳",
    "description": "a low mahogany gallery bench with a muted-rose padded seat",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/gallery-chair.png",
    "theme": "gallery"
  },
  "gallery-rug": {
    "id": "gallery-rug",
    "name": "石纹垫",
    "description": "a flat ivory square mosaic floor inlay with four broad rose stone corners",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/gallery-rug.png",
    "theme": "gallery"
  },
  "gallery-table": {
    "id": "gallery-table",
    "name": "雕像台",
    "description": "a squat ivory plinth with a chunky small bronze abstract sculpture",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/gallery-table.png",
    "theme": "gallery"
  },
  "gallery-plant": {
    "id": "gallery-plant",
    "name": "修画架",
    "description": "a sturdy mahogany easel with a gold-framed landscape canvas and a red repair cloth",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/gallery-plant.png",
    "theme": "gallery"
  },
  "lighthouse-chair": {
    "id": "lighthouse-chair",
    "name": "值守凳",
    "description": "a short chalk-white painted wooden keeper stool with a navy-blue seat",
    "verb": "坐",
    "role": "chair",
    "occupiable": true,
    "asset": "assets/props/lighthouse-chair.png",
    "theme": "lighthouse"
  },
  "lighthouse-rug": {
    "id": "lighthouse-rug",
    "name": "铁踏板",
    "description": "a flat square navy iron floor grate with four broad chalk-white bars",
    "verb": "站",
    "role": "rug",
    "occupiable": true,
    "asset": "assets/props/lighthouse-rug.png",
    "theme": "lighthouse"
  },
  "lighthouse-table": {
    "id": "lighthouse-table",
    "name": "塔灯",
    "description": "a squat white lighthouse beacon housing with a wide amber glass lens",
    "verb": "",
    "role": "table",
    "occupiable": false,
    "asset": "assets/props/lighthouse-table.png",
    "theme": "lighthouse"
  },
  "lighthouse-plant": {
    "id": "lighthouse-plant",
    "name": "船钟",
    "description": "a large brass hanging ship bell on a short navy-blue support",
    "verb": "",
    "role": "plant",
    "occupiable": false,
    "asset": "assets/props/lighthouse-plant.png",
    "theme": "lighthouse"
  },
  "chair": {
    "id": "chair",
    "name": "椅子",
    "role": "chair",
    "occupiable": true,
    "verb": "坐",
    "asset": "assets/chair.png",
    "theme": "legacy"
  },
  "rug": {
    "id": "rug",
    "name": "地毯",
    "role": "rug",
    "occupiable": true,
    "verb": "站",
    "asset": "assets/rug.png",
    "theme": "legacy"
  },
  "table": {
    "id": "table",
    "name": "桌子",
    "role": "table",
    "occupiable": false,
    "verb": "",
    "asset": "assets/table.png",
    "theme": "legacy"
  },
  "plant": {
    "id": "plant",
    "name": "盆栽",
    "role": "plant",
    "occupiable": false,
    "verb": "",
    "asset": "assets/plant.png",
    "theme": "legacy"
  }
},names={"cat":"小花","dog":"旺旺","mouse":"米粒","tiger":"阿虎","fox":"红尾","owl":"咕咕","rabbit":"小白","raccoon":"团团"},roles=['chair','rug','table','plant'];
 function get(id){const prop=props[id];if(!prop)throw Error('未定义的现场道具：'+id);return prop;}
 function theme(c){return themes[c&&c.theme]||themes.library;}
 function kinds(c){const t=theme(c);return roles.map(role=>t.props[role]);}
 function clue(c,p){
  const other=id=>c.characters.find(q=>q.id===id).name;
  if(p.victim)return p.name+'遇害时，只与凶手同区。';
  const phrases=p.rules.map(r=>{
   if(r.type==='in')return '在'+r.area;
   if(r.type==='not-in')return '没进'+r.area;
   if(r.type==='on')return get(r.kind).verb+'在'+(r.area?r.area+'的':'')+get(r.kind).name+'上';
   if(r.type==='not-on')return '没在'+get(r.kind).name+'上';
   if(r.type==='beside')return '身旁是'+get(r.kind).name;
   if(r.type==='not-beside')return '不挨着'+get(r.kind).name;
   if(r.type==='edge')return '在地图外圈';
   if(r.type==='corner')return '在地图角落';
   if(r.type==='alone')return '当时独处';
   if(r.type==='count')return '同区共'+r.count+'位';
   if(r.type==='with')return '与'+other(r.other)+'同区';
   if(r.type==='apart')return '没和'+other(r.other)+'同区';
   if(r.type==='above')return '比'+other(r.other)+'高'+r.rows+'行';
   if(r.type==='left')return '比'+other(r.other)+'靠左';
   throw Error('未知证词规则：'+r.type);
  });return p.name+phrases.join('，')+'。';
 }
 const api={themes,props,names,roles,get,theme,kinds,clue};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ForestProps=api;
})(typeof window!=='undefined'?window:this);
