-- MVStore
CREATE ALIAS IF NOT EXISTS READ_BLOB_MAP FOR 'org.h2.tools.Recover.readBlobMap';
CREATE ALIAS IF NOT EXISTS READ_CLOB_MAP FOR 'org.h2.tools.Recover.readClobMap';
-- LOB
CREATE TABLE IF NOT EXISTS INFORMATION_SCHEMA.LOB_BLOCKS(LOB_ID BIGINT, SEQ INT, DATA VARBINARY, PRIMARY KEY(LOB_ID, SEQ));
-- lobMap.size: 0
-- lobData.size: 0
-- Layout
-- chunk.203 = chunk:203,block:5,len:16,pages:60,livePages:2,max:1a940,liveMax:630,map:494,root:80c00054a803,time:a3d0fef,unusedAtVersion:209,version:203,toc:1592f,occupancy:ffffffffffffffffffffff9f
-- chunk.207 = chunk:207,block:2,len:3,pages:c,livePages:3,max:3330,liveMax:1100,map:4a8,root:81c00009b003,time:a3dc8bc,unusedAtVersion:209,version:207,toc:2b13,occupancy:3f0d
-- chunk.298 = chunk:298,block:82,len:17,pages:65,livePages:2,max:1b630,liveMax:630,map:640,root:a60000571ec3,time:b10706d,unusedAtVersion:29a,version:298,toc:164d1,occupancy:ffffffffffffffffffffffff13
-- chunk.799 = chunk:799,block:d6,len:19,pages:77,livePages:25,max:1c760,liveMax:a290,map:ab6,next:ef,root:1e64000581087,time:f7d1341,unusedAtVersion:996,version:799,toc:180aa,occupancy:75fd05f3ff0200feff18fcfffff77f
-- chunk.79b = chunk:79b,block:34,len:9,pages:25,livePages:4,max:a760,liveMax:2c00,map:ae4,next:3d,root:1e6c0002043c7,time:f7d21ab,unusedAtVersion:996,version:79b,toc:8b64,occupancy:f7cdffff1f
-- chunk.79c = chunk:79c,block:3d,len:18,pages:8e,livePages:6f,max:1d820,liveMax:1a590,map:afa,next:55,root:1e7000059f907,time:f7d23a4,unusedAtVersion:996,version:79c,toc:175af,occupancy:0101000800002000000223600c40c17f8c3d
-- chunk.79d = chunk:79d,block:55,len:3,pages:13,livePages:1,max:2be0,liveMax:c00,map:afa,next:58,root:1e74000071a07,time:f881850,unusedAtVersion:7a8,version:79d,toc:2657,occupancy:fdff07
-- chunk.79f = chunk:79f,block:58,len:4,pages:18,livePages:2,max:3d70,liveMax:18c0,map:afa,next:5c,root:1e7c000091607,time:f888ef7,unusedAtVersion:7c7,version:79f,toc:2fc8,occupancy:fbfdff
-- chunk.7a1 = chunk:7a1,block:61,len:3,pages:34,livePages:26,max:3220,liveMax:1a00,map:afa,next:64,root:1e8400007cb47,time:f889a74,unusedAtVersion:993,version:7a1,toc:2c05,occupancy:c0001f0030800f
-- chunk.7a7 = chunk:7a7,block:1b,len:2,pages:e,livePages:1,max:1e70,liveMax:400,map:afa,next:64,root:1e9c000030587,time:f91d733,unusedAtVersion:7a8,version:7a7,toc:199f,occupancy:fb3f
-- chunk.7af = chunk:7af,block:64,len:2,pages:e,livePages:1,max:1d70,liveMax:400,map:afa,next:66,root:1ebc00002e807,time:12ac7752,unusedAtVersion:7b0,version:7af,toc:19e3,occupancy:fb3f
-- chunk.7b5 = chunk:7b5,block:5c,len:2,pages:f,livePages:1,max:2130,liveMax:60,map:afa,next:68,root:1ed400002be87,time:12b5d75d,unusedAtVersion:7b7,version:7b5,toc:1ac7,occupancy:ff7e
-- chunk.7b9 = chunk:7b9,block:68,len:2,pages:f,livePages:2,max:2170,liveMax:360,map:afa,next:6c,root:1ee4000031087,time:12bf0ae9,unusedAtVersion:7b9,version:7b9,toc:1cb5,occupancy:db7f
-- chunk.7bf = chunk:7bf,block:66,len:2,pages:e,livePages:1,max:2030,liveMax:300,map:afa,next:6c,root:1efc00002e947,time:12ccedfd,unusedAtVersion:7c1,version:7bf,toc:1c0a,occupancy:fb3f
-- chunk.7cb = chunk:7cb,block:6e,len:2,pages:e,livePages:1,max:2170,liveMax:300,map:afa,next:73,root:1f2c000030dc7,time:12df6ed1,unusedAtVersion:7cc,version:7cb,toc:1ecc,occupancy:fb3f
-- chunk.7d1 = chunk:7d1,block:6c,len:2,pages:e,livePages:1,max:2070,liveMax:80,map:afa,next:73,root:1f4400002c407,time:12e8ae72,unusedAtVersion:7d1,version:7d1,toc:1e5b,occupancy:df3f
-- chunk.7d4 = chunk:7d4,block:75,len:3,pages:e,livePages:1,max:23f0,liveMax:300,map:afa,next:78,root:1f5000002e647,time:12ed4e59,unusedAtVersion:7d4,version:7d4,toc:1f99,occupancy:fb3f
-- chunk.7d6 = chunk:7d6,block:78,len:2,pages:e,livePages:1,max:20b0,liveMax:60,map:afa,next:7a,root:1f58000025307,time:12ed5bfe,unusedAtVersion:7d8,version:7d6,toc:1d06,occupancy:ff3e
-- chunk.7de = chunk:7de,block:7d,len:3,pages:e,livePages:1,max:2530,liveMax:300,map:afa,next:85,root:1f78000030e07,time:12ffcf29,unusedAtVersion:7df,version:7de,toc:21a3,occupancy:fb3f
-- chunk.7ea = chunk:7ea,block:80,len:3,pages:d,livePages:1,max:23b0,liveMax:300,map:afa,next:83,root:1fa800002d7c7,time:130db05a,unusedAtVersion:7eb,version:7ea,toc:2171,occupancy:fb1f
-- chunk.7f7 = chunk:7f7,block:7a,len:3,pages:e,livePages:1,max:2570,liveMax:300,map:afa,next:89,root:1fdc000031a87,time:13203b80,unusedAtVersion:7f7,version:7f7,toc:2341,occupancy:fb3f
-- chunk.7fb = chunk:7fb,block:70,len:3,pages:f,livePages:1,max:2530,liveMax:60,map:afa,next:83,root:1fec00002bec7,time:1324e499,unusedAtVersion:7fc,version:7fb,toc:21d3,occupancy:ff7e
-- chunk.7fe = chunk:7fe,block:8c,len:3,pages:e,livePages:2,max:2b70,liveMax:360,map:afa,next:8f,root:1ff8000030fc7,time:132e1804,unusedAtVersion:7fe,version:7fe,toc:2376,occupancy:db3f
-- chunk.808 = chunk:808,block:86,len:3,pages:d,livePages:1,max:2c70,liveMax:300,map:afa,next:8f,root:202000002da07,time:138a99c1,unusedAtVersion:80b,version:808,toc:239d,occupancy:fb1f
-- chunk.812 = chunk:812,block:8f,len:3,pages:e,livePages:1,max:2d70,liveMax:300,map:afa,next:92,root:2048000031287,time:13987831,unusedAtVersion:813,version:812,toc:25f8,occupancy:fb3f
-- chunk.818 = chunk:818,block:92,len:3,pages:d,livePages:1,max:2d70,liveMax:80,map:afa,next:95,root:2060000029007,time:13a1b844,unusedAtVersion:819,version:818,toc:24a5,occupancy:ef1f
-- chunk.81f = chunk:81f,block:9e,len:3,pages:e,livePages:1,max:2db0,liveMax:60,map:afa,next:a1,root:207c000031107,time:13a66c1d,unusedAtVersion:821,version:81f,toc:27e9,occupancy:ff3e
-- chunk.820 = chunk:820,block:95,len:3,pages:e,livePages:1,max:2ef0,liveMax:300,map:afa,next:98,root:2080000032587,time:13aafe83,unusedAtVersion:821,version:820,toc:27af,occupancy:fb3f
-- chunk.82c = chunk:82c,block:a4,len:4,pages:11,livePages:1,max:3630,liveMax:300,map:afa,next:a8,root:20b000004ab07,time:13b8dd86,unusedAtVersion:84d,version:82c,toc:2f4d,occupancy:efff01
-- chunk.833 = chunk:833,block:89,len:3,pages:e,livePages:2,max:2db0,liveMax:480,map:afa,next:98,root:20cc00002fd07,time:13cb2f20,unusedAtVersion:834,version:833,toc:27b8,occupancy:f53f
-- chunk.83a = chunk:83a,block:9b,len:3,pages:e,livePages:1,max:2db0,liveMax:300,map:afa,next:a1,root:20e8000034147,time:13d8eef4,unusedAtVersion:83b,version:83a,toc:2946,occupancy:fb3f
-- chunk.83d = chunk:83d,block:a1,len:3,pages:e,livePages:1,max:2ab0,liveMax:60,map:afa,next:a8,root:20f4000028687,time:13dd850b,unusedAtVersion:83e,version:83d,toc:2711,occupancy:ff3e
-- chunk.841 = chunk:841,block:a8,len:3,pages:e,livePages:1,max:2c70,liveMax:60,map:afa,next:ab,root:210400002e987,time:13e6af04,unusedAtVersion:842,version:841,toc:2952,occupancy:ef3f
-- chunk.842 = chunk:842,block:98,len:3,pages:d,livePages:1,max:2c30,liveMax:300,map:afa,next:ab,root:210800002c847,time:13eb41c1,unusedAtVersion:842,version:842,toc:29ca,occupancy:fb1f
-- chunk.849 = chunk:849,block:ae,len:3,pages:e,livePages:1,max:3430,liveMax:300,map:afa,next:b1,root:21240000304c7,time:13f90311,unusedAtVersion:84b,version:849,toc:2b2a,occupancy:fb3f
-- chunk.854 = chunk:854,block:ab,len:3,pages:e,livePages:1,max:35f0,liveMax:300,map:afa,next:b8,root:2150000030c87,time:143e6293,unusedAtVersion:854,version:854,toc:2db1,occupancy:fb3f
-- chunk.857 = chunk:857,block:b1,len:3,pages:e,livePages:1,max:34f0,liveMax:80,map:afa,next:bb,root:215c000028b87,time:144301d9,unusedAtVersion:858,version:857,toc:2c63,occupancy:df3f
-- chunk.85c = chunk:85c,block:be,len:3,pages:e,livePages:1,max:3430,liveMax:60,map:afa,next:c1,root:217000002d907,time:1447aa29,unusedAtVersion:85d,version:85c,toc:2e16,occupancy:ff3e
-- chunk.85f = chunk:85f,block:b8,len:3,pages:c,livePages:1,max:32f0,liveMax:300,map:afa,next:c1,root:217c00002c987,time:144c40cc,unusedAtVersion:85f,version:85f,toc:2dba,occupancy:fb0f
-- chunk.869 = chunk:869,block:c1,len:4,pages:e,livePages:1,max:35f0,liveMax:300,map:afa,next:c5,root:21a4000030c87,time:145ec2f0,unusedAtVersion:86a,version:869,toc:3087,occupancy:fb3f
-- chunk.875 = chunk:875,block:c9,len:4,pages:e,livePages:1,max:34f0,liveMax:300,map:afa,next:cd,root:21d400002fa07,time:146ca4aa,unusedAtVersion:876,version:875,toc:30f3,occupancy:fb3f
-- chunk.87f = chunk:87f,block:c5,len:4,pages:d,livePages:1,max:3430,liveMax:300,map:afa,next:d1,root:21fc00002db47,time:147f065c,unusedAtVersion:87f,version:87f,toc:306b,occupancy:fb1f
-- chunk.881 = chunk:881,block:b4,len:4,pages:f,livePages:1,max:33b0,liveMax:60,map:afa,next:ef,root:2204000028b07,time:147f0b90,unusedAtVersion:882,version:881,toc:2fee,occupancy:ff7e
-- chunk.886 = chunk:886,block:ef,len:4,pages:e,livePages:1,max:44f0,liveMax:60,map:afa,next:fb,root:22180000311c7,time:148836ee,unusedAtVersion:886,version:886,toc:3437,occupancy:ef3f
-- chunk.889 = chunk:889,block:f7,len:4,pages:d,livePages:1,max:4490,liveMax:300,map:afa,next:fb,root:2224000033a07,time:148cce36,unusedAtVersion:889,version:889,toc:33be,occupancy:fb1f
-- chunk.896 = chunk:896,block:83,len:3,pages:e,livePages:1,max:2e50,liveMax:300,map:afa,next:cd,root:2258000032489,time:15086b50,unusedAtVersion:897,version:896,toc:248b,occupancy:fb3f
-- chunk.89f = chunk:89f,block:cd,len:3,pages:e,livePages:1,max:2d90,liveMax:300,map:afa,next:fb,root:227c000031189,time:15164f2c,unusedAtVersion:89f,version:89f,toc:24f5,occupancy:fb3f
-- chunk.8a2 = chunk:8a2,block:fb,len:3,pages:c,livePages:1,max:2a10,liveMax:80,map:afa,next:fe,root:2288000025749,time:1524110d,unusedAtVersion:8a3,version:8a2,toc:21c6,occupancy:ef0f
-- chunk.8a8 = chunk:8a8,block:fe,len:3,pages:e,livePages:1,max:2cd0,liveMax:60,map:afa,next:10a,root:22a000002d849,time:1528ca5c,unusedAtVersion:8ab,version:8a8,toc:2545,occupancy:ff3e
-- chunk.8ad = chunk:8ad,block:f3,len:3,pages:d,livePages:1,max:2c90,liveMax:300,map:afa,next:107,root:22b400002eb49,time:15320354,unusedAtVersion:8ae,version:8ad,toc:2680,occupancy:fb1f
-- chunk.8ba = chunk:8ba,block:bb,len:3,pages:e,livePages:1,max:2d90,liveMax:300,map:afa,next:10a,root:22e8000031189,time:153ffaa4,unusedAtVersion:8ba,version:8ba,toc:27d0,occupancy:fb3f
-- chunk.8c7 = chunk:8c7,block:d3,len:3,pages:d,livePages:1,max:2cd0,liveMax:300,map:afa,next:10a,root:231c00002f609,time:17c0ab72,unusedAtVersion:8c8,version:8c7,toc:281c,occupancy:fb1f
-- chunk.8d2 = chunk:8d2,block:10a,len:3,pages:e,livePages:1,max:2d90,liveMax:300,map:afa,next:10d,root:23480000322c9,time:17cea527,unusedAtVersion:8d2,version:8d2,toc:2985,occupancy:fb3f
-- chunk.8d4 = chunk:8d4,block:10d,len:3,pages:e,livePages:1,max:2a50,liveMax:60,map:afa,next:110,root:2350000028f49,time:17ceb6c1,unusedAtVersion:8d6,version:8d4,toc:26f3,occupancy:ff3e
-- chunk.8d9 = chunk:8d9,block:110,len:3,pages:d,livePages:1,max:2cd0,liveMax:60,map:afa,next:119,root:2364000029689,time:17d7f218,unusedAtVersion:8da,version:8d9,toc:298a,occupancy:ef1f
-- chunk.8e1 = chunk:8e1,block:113,len:3,pages:e,livePages:1,max:2e30,liveMax:300,map:afa,next:116,root:2384000033b49,time:17e1410d,unusedAtVersion:8e1,version:8e1,toc:2c0d,occupancy:fb3f
-- chunk.8ed = chunk:8ed,block:d0,len:3,pages:d,livePages:1,max:34d0,liveMax:300,map:afa,next:119,root:23b4000030ec9,time:17ef390b,unusedAtVersion:8ef,version:8ed,toc:2c05,occupancy:fb1f
-- chunk.8fb = chunk:8fb,block:116,len:3,pages:f,livePages:2,max:3690,liveMax:380,map:afa,next:11d,root:23ec000035389,time:1801d582,unusedAtVersion:8fc,version:8fb,toc:2dde,occupancy:bb7f
-- chunk.902 = chunk:902,block:126,len:3,pages:e,livePages:1,max:34d0,liveMax:60,map:afa,next:129,root:240800002dc89,time:18069153,unusedAtVersion:904,version:902,toc:2d4a,occupancy:ff3e
-- chunk.908 = chunk:908,block:107,len:3,pages:d,livePages:1,max:3490,liveMax:300,map:afa,next:120,root:2420000030b49,time:180fcd0f,unusedAtVersion:90a,version:908,toc:2e1d,occupancy:fb1f
-- chunk.919 = chunk:919,block:120,len:3,pages:d,livePages:1,max:34d0,liveMax:300,map:afa,next:123,root:2464000030f89,time:1822633c,unusedAtVersion:91b,version:919,toc:2ef6,occupancy:fb1f
-- chunk.925 = chunk:925,block:129,len:4,pages:e,livePages:1,max:3690,liveMax:300,map:afa,next:12d,root:2494000033ac9,time:18306198,unusedAtVersion:925,version:925,toc:305a,occupancy:fb3f
-- chunk.933 = chunk:933,block:13c,len:4,pages:e,livePages:1,max:3650,liveMax:60,map:afa,next:140,root:24cc000034ac9,time:1844cf5a,unusedAtVersion:936,version:933,toc:311c,occupancy:ff3e
-- chunk.934 = chunk:934,block:131,len:4,pages:d,livePages:1,max:35d0,liveMax:300,map:afa,next:135,root:24d0000031ac9,time:18496245,unusedAtVersion:935,version:934,toc:3093,occupancy:fb1f
-- chunk.938 = chunk:938,block:11c,len:4,pages:e,livePages:1,max:3690,liveMax:60,map:afa,next:140,root:24e000002dbc9,time:184e0bf8,unusedAtVersion:939,version:938,toc:3105,occupancy:ef3f
-- chunk.940 = chunk:940,block:123,len:3,pages:d,livePages:1,max:2570,liveMax:300,map:afa,next:135,root:2500000031049,time:18575b8f,unusedAtVersion:942,version:940,toc:23a8,occupancy:fb1f
-- chunk.952 = chunk:952,block:119,len:3,pages:d,livePages:1,max:2dd0,liveMax:300,map:afa,next:138,root:2548000032cc9,time:186d6b6b,unusedAtVersion:953,version:952,toc:25a8,occupancy:fb1f
-- chunk.961 = chunk:961,block:135,len:3,pages:d,livePages:1,max:2e10,liveMax:80,map:afa,next:140,root:25840000319c9,time:187b5257,unusedAtVersion:962,version:961,toc:2614,occupancy:ef1f
-- chunk.962 = chunk:962,block:138,len:3,pages:e,livePages:2,max:2da0,liveMax:480,map:afa,next:140,root:2588000032849,time:187b5599,unusedAtVersion:964,version:962,toc:2579,occupancy:f53f
-- chunk.968 = chunk:968,block:151,len:3,pages:e,livePages:1,max:2a60,liveMax:60,map:afa,next:154,root:25a0000029fc9,time:188014cb,unusedAtVersion:96a,version:968,toc:2564,occupancy:ff3e
-- chunk.970 = chunk:970,block:148,len:3,pages:e,livePages:1,max:2de0,liveMax:300,map:afa,next:14b,root:25c0000032349,time:188dec14,unusedAtVersion:971,version:970,toc:2799,occupancy:fb3f
-- chunk.974 = chunk:974,block:140,len:3,pages:e,livePages:2,max:33e0,liveMax:780,map:afa,next:154,root:25d000003fb89,time:189290c6,unusedAtVersion:974,version:974,toc:2bb1,occupancy:fc3f
-- chunk.97b = chunk:97b,block:12d,len:3,pages:d,livePages:1,max:2c60,liveMax:300,map:afa,next:154,root:25ec00002ee09,time:189bdc79,unusedAtVersion:97d,version:97b,toc:276d,occupancy:fb1f
-- chunk.989 = chunk:989,block:14e,len:3,pages:e,livePages:1,max:2e20,liveMax:300,map:afa,next:157,root:2624000033549,time:18ae6e72,unusedAtVersion:98b,version:989,toc:2951,occupancy:fb3f
-- chunk.990 = chunk:990,block:15d,len:3,pages:c,livePages:1,max:2c20,liveMax:c0,map:afa,next:160,root:264000002ab89,time:18b32454,unusedAtVersion:990,version:990,toc:2872,occupancy:ef0f
-- chunk.991 = chunk:991,block:160,len:3,pages:c,livePages:8,max:2c20,liveMax:ca0,map:afa,next:163,root:264400002ab89,time:18b3264f,unusedAtVersion:991,version:991,toc:2929,occupancy:000f
-- chunk.994 = chunk:994,block:16e,len:5,pages:13,livePages:5,max:5600,liveMax:cc0,map:afa,next:173,root:2650000050989,time:18b3302c,unusedAtVersion:994,version:994,toc:465c,occupancy:c6f707
-- chunk.995 = chunk:995,block:101,len:5,pages:11,livePages:1,max:5ad0,liveMax:1000,map:afa,next:143,root:265400003df89,time:18b5dca4,unusedAtVersion:996,version:995,toc:4eb4,occupancy:ffef01
-- chunk.996 = chunk:996,block:5e,len:3,pages:11,livePages:e,max:2f80,liveMax:1600,map:afa,next:143,root:2658000036f89,time:18b5df3e,unusedAtVersion:996,version:996,toc:2c6b,occupancy:0070
-- meta.id = 1
-- root.1 = 265c00005b08d
-- root.2 = 265c000002b4d
-- root.3e1 = 1e84000077b4c
-- root.3e2 = 1e8400007b504
-- root.3e3 = 1e8400007c180
-- root.3ea = 1e8400007c640
-- root.5 = 25d0000002b4f
-- root.6a = 1e84000005ad6
-- root.92 = 1e70000289586
-- root.93 = 1e7000028ad00
-- root.97 = 1e7000028b44c
-- root.98 = 1e8400001cb0e
-- root.99 = 1e7000028f2cc
-- root.9a = 2644000002b45
-- root.9b = 1e700004c0596
-- root.9d = 2658000002b52
-- root.9e = 1e700004d51d0
-- root.9f = 1e700004dbc06
-- root.a1 = 1e84000021712
-- root.a13 = 1e84000002b0a
-- root.a14 = 1e84000005380
-- root.a15 = 1e84000005700
-- root.a1f = 1e7000028588c
-- root.a2 = 1e700004dcec0
-- root.a20 = 1e70000288b80
-- root.a23 = 1e70000289080
-- root.a3 = 1e700004dd340
-- root.a4 = 1e700004dd854
-- root.a7 = 2650000002b48
-- root.a8 = 265800000d703
-- root.aa = 1e8400003a341
-- root.ac6 = 1e840000527ca
-- root.ac7 = 1e84000055380
-- root.acf = 1e84000059f94
-- root.ad = 1e700004f27c0
-- root.ad0 = 1e84000068e46
-- root.ad3 = 1e8400006ad00
-- root.ad6 = 1e8400006b200
-- root.ad9 = 1e8400006b700
-- root.adc = 1e8400006bbc0
-- root.adf = 1e8400006c0c0
-- root.ae = 1e700004f2fc0
-- root.ae2 = 1e8400006c580
-- root.ae5 = 265800002ec0c
-- root.ae8 = 2658000031c8e
-- root.aeb = 1e84000074dc8
-- root.aee = 1e84000076c00
-- root.af = 264400001988f
-- root.af1 = 1e84000076fc0
-- root.af4 = 1e84000077340
-- root.af8 = 1e840000776c0
-- root.b = 1e6400037aad4
-- root.b0 = 264400002184f
-- root.b2 = 265800001bfd0
-- root.b3 = 2658000023a44
-- root.b4 = 1e7000051c7c0
-- root.b5 = 1e84000044bc0
-- root.b6 = 1e84000045100
-- root.b7 = 1e84000045640
-- root.b8 = 1e84000045ac2
-- root.b9 = 1e840000466c0
-- root.ba = 1e84000046b46
-- root.be = 265000003d800
-- root.bf = 265800002478c
-- root.c = 1e64000388142
-- root.c0 = 265800002780e
-- root.c1 = 265800002cb02
-- root.c4 = 265800002d602
-- root.c5 = 265800002e102
-- root.c7 = 1e84000054982
-- root.c8 = 1e84000055706
-- root.ca = 1e84000056e0c
-- root.d0 = 1e7000051d100
-- root.d1 = 1e7000051d740
-- root.d2 = 1e8400006a280
-- root.d3 = 1e8400006a7c0
-- root.d4 = 1e7000051dd42
-- root.d6 = 1e7000051e600
-- root.d7 = 1e7000051e9c0
-- root.dd = 2650000048180
-- Meta
-- map.2 = name:_
-- map.2e = name:table.18,createVersion:3,key:8fa25204,val:c6a36c75
-- map.2f = name:index.21,createVersion:3,key:8b8bd65d,val:84856ba3
-- map.3 = name:openTransactions
-- map.30 = name:index.22,createVersion:3,key:8b8bcb1b,val:84856ba3
-- map.31 = name:table.23,createVersion:4,key:8fa25204,val:f25aa7b7
-- map.3e1 = name:table.233,createVersion:176,key:8fa25204,val:a7c220e9
-- map.3e2 = name:index.236,createVersion:176,key:8b953527,val:ac2fc060
-- map.3e3 = name:index.238,createVersion:176,key:8b954079,val:ac2fc060
-- map.3ea = name:index.134,createVersion:177,key:8b954437,val:ac2fc060
-- map.5 = name:table.0,key:8fa25204,val:5803b3f1
-- map.6 = name:lobMap,key:8fa25204,val:f4470498
-- map.65 = name:table.56,createVersion:4,key:8fa25204,val:f54c0b7d
-- map.66 = name:index.59,createVersion:4,key:8b8f6e13,val:84856ba3
-- map.67 = name:index.60,createVersion:4,key:8b8f71d5,val:84856ba3
-- map.68 = name:index.61,createVersion:4,key:8b8f7955,val:84856ba3
-- map.69 = name:table.8,createVersion:4,key:8fa25204,val:6cbc638a
-- map.6a = name:table.25,createVersion:4,key:8fa25204,val:265d65fc
-- map.6b = name:table.63,createVersion:4,key:8fa25204,val:915e803b
-- map.7 = name:tempLobMap,key:8fa25204,val:59a6a071
-- map.8 = name:lobRef,key:eabe0274,val:51bee6cd
-- map.9 = name:lobData,key:8fa25204,val:59a6a071
-- map.92 = name:table.12,createVersion:4,key:8fa25204,val:48f3eb48
-- map.93 = name:index.15,createVersion:4,key:8b8fe272,val:84856ba3
-- map.96 = name:table.17,createVersion:4,key:8fa25204,val:48f3eb48
-- map.97 = name:table.71,createVersion:4,key:8fa25204,val:2efc8306
-- map.98 = name:table.75,createVersion:4,key:8fa25204,val:6cbc638a
-- map.99 = name:table.79,createVersion:4,key:8fa25204,val:15d5a01e
-- map.9a = name:table.83,createVersion:4,key:8fa25204,val:6cbc638a
-- map.9b = name:table.87,createVersion:5,key:8fa25204,val:15d5a01e
-- map.9d = name:table.95,createVersion:5,key:8fa25204,val:5803b3f1
-- map.9e = name:table.99,createVersion:5,key:8fa25204,val:9efb620e
-- map.9f = name:table.102,createVersion:5,key:8fa25204,val:811c0840
-- map.a0 = name:table.106,createVersion:5,key:8fa25204,val:5eb2888f
-- map.a1 = name:table.107,createVersion:5,key:8fa25204,val:e497a19
-- map.a13 = name:table.32,createVersion:694,key:8fa25204,val:2efc8306
-- map.a14 = name:index.38,createVersion:694,key:8b8ef9b4,val:dace3871
-- map.a15 = name:index.39,createVersion:694,key:8b8f1034,val:dace3871
-- map.a1f = name:table.27,createVersion:694,key:8fa25204,val:915e803b
-- map.a2 = name:table.111,createVersion:5,key:8fa25204,val:5eb2888f
-- map.a20 = name:index.31,createVersion:694,key:8b8e8555,val:dace3871
-- map.a23 = name:index.33,createVersion:694,key:8b8e8917,val:dace3871
-- map.a3 = name:table.112,createVersion:5,key:8fa25204,val:5eb2888f
-- map.a4 = name:table.113,createVersion:5,key:8fa25204,val:300942b2
-- map.a5 = name:table.116,createVersion:5,key:8fa25204,val:32b6e533
-- map.a7 = name:table.124,createVersion:5,key:8fa25204,val:15d5a01e
-- map.a8 = name:table.128,createVersion:5,key:8fa25204,val:ad369c5b
-- map.aa = name:table.136,createVersion:5,key:8fa25204,val:300942b2
-- map.ab = name:index.140,createVersion:5,key:8b8cd1e9,val:84856ba3
-- map.ac = name:index.142,createVersion:5,key:8b900444,val:84856ba3
-- map.ac6 = name:table.167,createVersion:79a,key:8fa25204,val:915e803b
-- map.ac7 = name:index.170,createVersion:79a,key:8b8e9817,val:98921cf5
-- map.acb = name:table.272,createVersion:79a,key:8fa25204,val:811c0840
-- map.acc = name:index.275,createVersion:79a,key:8b8c433c,val:98921cf5
-- map.acd = name:index.277,createVersion:79a,key:8b8c3f7a,val:98921cf5
-- map.acf = name:table.44,createVersion:79a,key:8fa25204,val:a6913b43
-- map.ad = name:index.144,createVersion:5,key:8b8b5a7e,val:84856ba3
-- map.ad0 = name:index.51,createVersion:79a,key:8ba1199f,val:98921cf5
-- map.ad3 = name:index.123,createVersion:79a,key:8ba11d5d,val:98921cf5
-- map.ad6 = name:index.269,createVersion:79a,key:8ba124dd,val:98921cf5
-- map.ad9 = name:index.282,createVersion:79a,key:8ba1302f,val:98921cf5
-- map.adc = name:index.287,createVersion:79a,key:8ba1211f,val:98921cf5
-- map.adf = name:index.290,createVersion:79a,key:8ba1289f,val:98921cf5
-- map.ae = name:index.146,createVersion:5,key:8b8b697e,val:84856ba3
-- map.ae2 = name:index.292,createVersion:79a,key:8ba12c6d,val:98921cf5
-- map.ae5 = name:index.40,createVersion:79b,key:8b9d7e27,val:98921cf5
-- map.ae8 = name:index.46,createVersion:79b,key:8b9d3e45,val:98921cf5
-- map.aeb = name:index.48,createVersion:79b,key:8bacd9a8,val:98921cf5
-- map.aee = name:index.122,createVersion:79b,key:8b8e9f97,val:98921cf5
-- map.af = name:index.148,createVersion:5,key:8b910b12,val:84856ba3
-- map.af1 = name:index.177,createVersion:79b,key:8b8ea727,val:98921cf5
-- map.af4 = name:index.251,createVersion:79b,key:8b8e9bd5,val:98921cf5
-- map.af7 = name:index.253,createVersion:79b,key:8b8c523c,val:98921cf5
-- map.af8 = name:index.255,createVersion:79b,key:8ba1700d,val:98921cf5
-- map.afb = name:undoLog.1,createVersion:996
-- map.afc = name:undoLog.2,createVersion:996
-- map.b = name:table.4,createVersion:1,key:8fa25204,val:f25aa7b7
-- map.b0 = name:index.149,createVersion:5,key:8b90ffc0,val:84856ba3
-- map.b2 = name:index.153,createVersion:6,key:8b89fd61,val:84856ba3
-- map.b3 = name:index.155,createVersion:6,key:8b8a011f,val:84856ba3
-- map.b4 = name:index.157,createVersion:6,key:8b8c55fa,val:84856ba3
-- map.b5 = name:index.159,createVersion:6,key:8b9cc647,val:84856ba3
-- map.b6 = name:index.160,createVersion:6,key:8b9cbec7,val:84856ba3
-- map.b7 = name:index.161,createVersion:6,key:8b9cb379,val:84856ba3
-- map.b8 = name:index.162,createVersion:6,key:8b9ca837,val:84856ba3
-- map.b9 = name:index.163,createVersion:6,key:8b9cafb7,val:84856ba3
-- map.ba = name:index.164,createVersion:6,key:8b9cabf9,val:84856ba3
-- map.be = name:index.172,createVersion:6,key:8b8b697e,val:84856ba3
-- map.bf = name:index.174,createVersion:6,key:8b9d7e27,val:84856ba3
-- map.c = name:index.7,createVersion:1,key:8b8cd1e9,val:84856ba3
-- map.c0 = name:index.175,createVersion:6,key:8b9d3e45,val:84856ba3
-- map.c1 = name:index.176,createVersion:6,key:8b9da785,val:84856ba3
-- map.c4 = name:index.181,createVersion:6,key:8b9d45c5,val:84856ba3
-- map.c5 = name:index.183,createVersion:6,key:8b9d5117,val:84856ba3
-- map.c7 = name:index.187,createVersion:6,key:8b94bd0a,val:84856ba3
-- map.c8 = name:index.188,createVersion:6,key:8b94cc1a,val:84856ba3
-- map.ca = name:index.191,createVersion:6,key:8b94c48a,val:84856ba3
-- map.cb = name:index.195,createVersion:6,key:8b8f9ee5,val:84856ba3
-- map.cc = name:index.197,createVersion:6,key:8b8fa2a3,val:84856ba3
-- map.cd = name:index.200,createVersion:6,key:8b8eb265,val:84856ba3
-- map.ce = name:index.202,createVersion:6,key:8b901702,val:84856ba3
-- map.cf = name:index.204,createVersion:6,key:8b901ac4,val:84856ba3
-- map.d0 = name:index.206,createVersion:6,key:8b8f26c4,val:84856ba3
-- map.d1 = name:index.208,createVersion:6,key:8b8f2a86,val:84856ba3
-- map.d2 = name:index.210,createVersion:6,key:8b910750,val:84856ba3
-- map.d3 = name:index.212,createVersion:6,key:8b910b12,val:84856ba3
-- map.d4 = name:index.215,createVersion:6,key:8b8b697e,val:84856ba3
-- map.d5 = name:index.220,createVersion:6,key:8b890d13,val:84856ba3
-- map.d6 = name:index.222,createVersion:6,key:8b890d13,val:84856ba3
-- map.d7 = name:index.224,createVersion:6,key:8b890d13,val:84856ba3
-- map.d8 = name:index.227,createVersion:6,key:8b8af15d,val:84856ba3
-- map.dd = name:index.239,createVersion:6,key:8b8b65bc,val:84856ba3
-- name._ = 2
-- name.index.122 = aee
-- name.index.123 = ad3
-- name.index.134 = 3ea
-- name.index.140 = ab
-- name.index.142 = ac
-- name.index.144 = ad
-- name.index.146 = ae
-- name.index.148 = af
-- name.index.149 = b0
-- name.index.15 = 93
-- name.index.153 = b2
-- name.index.155 = b3
-- name.index.157 = b4
-- name.index.159 = b5
-- name.index.160 = b6
-- name.index.161 = b7
-- name.index.162 = b8
-- name.index.163 = b9
-- name.index.164 = ba
-- name.index.170 = ac7
-- name.index.172 = be
-- name.index.174 = bf
-- name.index.175 = c0
-- name.index.176 = c1
-- name.index.177 = af1
-- name.index.181 = c4
-- name.index.183 = c5
-- name.index.187 = c7
-- name.index.188 = c8
-- name.index.191 = ca
-- name.index.195 = cb
-- name.index.197 = cc
-- name.index.200 = cd
-- name.index.202 = ce
-- name.index.204 = cf
-- name.index.206 = d0
-- name.index.208 = d1
-- name.index.21 = 2f
-- name.index.210 = d2
-- name.index.212 = d3
-- name.index.215 = d4
-- name.index.22 = 30
-- name.index.220 = d5
-- name.index.222 = d6
-- name.index.224 = d7
-- name.index.227 = d8
-- name.index.236 = 3e2
-- name.index.238 = 3e3
-- name.index.239 = dd
-- name.index.251 = af4
-- name.index.253 = af7
-- name.index.255 = af8
-- name.index.269 = ad6
-- name.index.275 = acc
-- name.index.277 = acd
-- name.index.282 = ad9
-- name.index.287 = adc
-- name.index.290 = adf
-- name.index.292 = ae2
-- name.index.31 = a20
-- name.index.33 = a23
-- name.index.38 = a14
-- name.index.39 = a15
-- name.index.40 = ae5
-- name.index.46 = ae8
-- name.index.48 = aeb
-- name.index.51 = ad0
-- name.index.59 = 66
-- name.index.60 = 67
-- name.index.61 = 68
-- name.index.7 = c
-- name.lobData = 9
-- name.lobMap = 6
-- name.lobRef = 8
-- name.openTransactions = 3
-- name.table.0 = 5
-- name.table.102 = 9f
-- name.table.106 = a0
-- name.table.107 = a1
-- name.table.111 = a2
-- name.table.112 = a3
-- name.table.113 = a4
-- name.table.116 = a5
-- name.table.12 = 92
-- name.table.124 = a7
-- name.table.128 = a8
-- name.table.136 = aa
-- name.table.167 = ac6
-- name.table.17 = 96
-- name.table.18 = 2e
-- name.table.23 = 31
-- name.table.233 = 3e1
-- name.table.25 = 6a
-- name.table.27 = a1f
-- name.table.272 = acb
-- name.table.32 = a13
-- name.table.4 = b
-- name.table.44 = acf
-- name.table.56 = 65
-- name.table.63 = 6b
-- name.table.71 = 97
-- name.table.75 = 98
-- name.table.79 = 99
-- name.table.8 = 69
-- name.table.83 = 9a
-- name.table.87 = 9b
-- name.table.95 = 9d
-- name.table.99 = 9e
-- name.tempLobMap = 7
-- name.undoLog.1 = afb
-- name.undoLog.2 = afc
-- Types
-- 10e707a2 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 13aa3ce7 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 13b99178 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 14bfb1f8 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 15d5a01e = org.h2.mvstore.tx.VersionedValueType@15d5a01e
-- 161f564 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 16ef1160 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 1868ed54 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 1e23ee0e = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 1e3566e = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 1fc2a7ec = org.h2.mvstore.tx.VersionedValueType@1fc2a7ec
-- 1fca53a7 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 23c0ddef = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 2507a170 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 265d65fc = org.h2.mvstore.tx.VersionedValueType@265d65fc
-- 26a9c6df = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 2773504f = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 2820b369 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 28655b72 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 2b44e768 = org.h2.mvstore.tx.VersionedValueType@2b44e768
-- 2c44596 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 2efc8306 = org.h2.mvstore.tx.VersionedValueType@2efc8306
-- 2f70df11 = org.h2.mvstore.tx.VersionedValueType@2f70df11
-- 300942b2 = org.h2.mvstore.tx.VersionedValueType@300942b2
-- 3118eb2c = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 32b6e533 = org.h2.mvstore.tx.VersionedValueType@32b6e533
-- 34070bd2 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 3af39e7b = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 3c7fac3e = org.h2.mvstore.tx.VersionedValueType@3c7fac3e
-- 3cb173db = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 3d1180 = org.h2.mvstore.tx.VersionedValueType@3d1180
-- 3d850265 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 40a7974 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 41f90b10 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 42dc6ef9 = org.h2.mvstore.tx.VersionedValueType@42dc6ef9
-- 433ae0b0 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 43d1da5a = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 4805069b = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 48e3bb4f = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 48f3eb48 = org.h2.mvstore.tx.VersionedValueType@48f3eb48
-- 4ca4c49e = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 4da9919b = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 5025a98f = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 51bee6cd = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 531c322b = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 53918b5e = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 54ca9420 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 55ba156d = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 57678f26 = org.h2.mvstore.tx.VersionedValueType@57678f26
-- 5803b3f1 = org.h2.mvstore.tx.VersionedValueType@5803b3f1
-- 59a6a071 = org.h2.mvstore.type.ByteArrayDataType@59a6a071
-- 5a17f25 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 5ad83772 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 5c8de057 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 5cefe221 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 5d74507c = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 5eb2888f = org.h2.mvstore.tx.VersionedValueType@5eb2888f
-- 5eb3a958 = org.h2.mvstore.tx.VersionedValueType@5eb3a958
-- 5ed54828 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 61470265 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 635aeccc = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 6386149d = org.h2.mvstore.tx.VersionedValueType@6386149d
-- 65a4b9d6 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 65cb5d4c = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 65f20b66 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 6802d023 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 6ad869dc = org.h2.mvstore.tx.VersionedValueType@6ad869dc
-- 6b16b028 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 6b87e36f = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 6bbc42bf = org.h2.mvstore.tx.VersionedValueType@6bbc42bf
-- 6c5095de = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 6cbc638a = org.h2.mvstore.tx.VersionedValueType@6cbc638a
-- 6e2c9341 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 6ef3afbc = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 6f15d60e = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 70a12cc1 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 7181ae3f = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 732aba6c = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 74ea9a67 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 77a57272 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 79144d0e = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 7a35a0eb = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 7e20f4e3 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- 80819803 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 811c0840 = org.h2.mvstore.tx.VersionedValueType@811c0840
-- 81f1194e = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 84856ba3 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 851e24e1 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 8613cdba = org.h2.mvstore.tx.VersionedValueType@8613cdba
-- 8627bf45 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 86aa0630 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 884fdd12 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 89b66d39 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 89d46f4f = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 8b890d13 = org.h2.mvstore.db.RowDataType@8b890d13
-- 8b89fd61 = org.h2.mvstore.db.RowDataType@8b89fd61
-- 8b8a011f = org.h2.mvstore.db.RowDataType@8b8a011f
-- 8b8a6dfe = org.h2.mvstore.db.RowDataType@8b8a6dfe
-- 8b8a71c0 = org.h2.mvstore.db.RowDataType@8b8a71c0
-- 8b8a7940 = org.h2.mvstore.db.RowDataType@8b8a7940
-- 8b8ae25d = org.h2.mvstore.db.RowDataType@8b8ae25d
-- 8b8ae61f = org.h2.mvstore.db.RowDataType@8b8ae61f
-- 8b8aed9f = org.h2.mvstore.db.RowDataType@8b8aed9f
-- 8b8af15d = org.h2.mvstore.db.RowDataType@8b8af15d
-- 8b8b56bc = org.h2.mvstore.db.RowDataType@8b8b56bc
-- 8b8b5a7e = org.h2.mvstore.db.RowDataType@8b8b5a7e
-- 8b8b61fe = org.h2.mvstore.db.RowDataType@8b8b61fe
-- 8b8b65bc = org.h2.mvstore.db.RowDataType@8b8b65bc
-- 8b8b697e = org.h2.mvstore.db.RowDataType@8b8b697e
-- 8b8bcb1b = org.h2.mvstore.db.RowDataType@8b8bcb1b
-- 8b8bcedd = org.h2.mvstore.db.RowDataType@8b8bcedd
-- 8b8bd65d = org.h2.mvstore.db.RowDataType@8b8bd65d
-- 8b8bdddd = org.h2.mvstore.db.RowDataType@8b8bdddd
-- 8b8c3f7a = org.h2.mvstore.db.RowDataType@8b8c3f7a
-- 8b8c433c = org.h2.mvstore.db.RowDataType@8b8c433c
-- 8b8c4abc = org.h2.mvstore.db.RowDataType@8b8c4abc
-- 8b8c523c = org.h2.mvstore.db.RowDataType@8b8c523c
-- 8b8c55fa = org.h2.mvstore.db.RowDataType@8b8c55fa
-- 8b8cb3d9 = org.h2.mvstore.db.RowDataType@8b8cb3d9
-- 8b8cb79b = org.h2.mvstore.db.RowDataType@8b8cb79b
-- 8b8cbf1b = org.h2.mvstore.db.RowDataType@8b8cbf1b
-- 8b8cc69b = org.h2.mvstore.db.RowDataType@8b8cc69b
-- 8b8cd1e9 = org.h2.mvstore.db.RowDataType@8b8cd1e9
-- 8b8d2838 = org.h2.mvstore.db.RowDataType@8b8d2838
-- 8b8d2bfa = org.h2.mvstore.db.RowDataType@8b8d2bfa
-- 8b8d337a = org.h2.mvstore.db.RowDataType@8b8d337a
-- 8b8d3afa = org.h2.mvstore.db.RowDataType@8b8d3afa
-- 8b8d9c97 = org.h2.mvstore.db.RowDataType@8b8d9c97
-- 8b8da059 = org.h2.mvstore.db.RowDataType@8b8da059
-- 8b8da7d9 = org.h2.mvstore.db.RowDataType@8b8da7d9
-- 8b8daf59 = org.h2.mvstore.db.RowDataType@8b8daf59
-- 8b8e10f6 = org.h2.mvstore.db.RowDataType@8b8e10f6
-- 8b8e14b8 = org.h2.mvstore.db.RowDataType@8b8e14b8
-- 8b8e1c38 = org.h2.mvstore.db.RowDataType@8b8e1c38
-- 8b8e23b8 = org.h2.mvstore.db.RowDataType@8b8e23b8
-- 8b8e8555 = org.h2.mvstore.db.RowDataType@8b8e8555
-- 8b8e8917 = org.h2.mvstore.db.RowDataType@8b8e8917
-- 8b8e9097 = org.h2.mvstore.db.RowDataType@8b8e9097
-- 8b8e9817 = org.h2.mvstore.db.RowDataType@8b8e9817
-- 8b8e9bd5 = org.h2.mvstore.db.RowDataType@8b8e9bd5
-- 8b8e9f97 = org.h2.mvstore.db.RowDataType@8b8e9f97
-- 8b8ea727 = org.h2.mvstore.db.RowDataType@8b8ea727
-- 8b8eb265 = org.h2.mvstore.db.RowDataType@8b8eb265
-- 8b8ef9b4 = org.h2.mvstore.db.RowDataType@8b8ef9b4
-- 8b8efd76 = org.h2.mvstore.db.RowDataType@8b8efd76
-- 8b8f04f6 = org.h2.mvstore.db.RowDataType@8b8f04f6
-- 8b8f1034 = org.h2.mvstore.db.RowDataType@8b8f1034
-- 8b8f26c4 = org.h2.mvstore.db.RowDataType@8b8f26c4
-- 8b8f2a86 = org.h2.mvstore.db.RowDataType@8b8f2a86
-- 8b8f6e13 = org.h2.mvstore.db.RowDataType@8b8f6e13
-- 8b8f71d5 = org.h2.mvstore.db.RowDataType@8b8f71d5
-- 8b8f7955 = org.h2.mvstore.db.RowDataType@8b8f7955
-- 8b8f8493 = org.h2.mvstore.db.RowDataType@8b8f8493
-- 8b8f9ee5 = org.h2.mvstore.db.RowDataType@8b8f9ee5
-- 8b8fa2a3 = org.h2.mvstore.db.RowDataType@8b8fa2a3
-- 8b8fe272 = org.h2.mvstore.db.RowDataType@8b8fe272
-- 8b8ff8f2 = org.h2.mvstore.db.RowDataType@8b8ff8f2
-- 8b900444 = org.h2.mvstore.db.RowDataType@8b900444
-- 8b901702 = org.h2.mvstore.db.RowDataType@8b901702
-- 8b901ac4 = org.h2.mvstore.db.RowDataType@8b901ac4
-- 8b9056d1 = org.h2.mvstore.db.RowDataType@8b9056d1
-- 8b906d51 = org.h2.mvstore.db.RowDataType@8b906d51
-- 8b90ffc0 = org.h2.mvstore.db.RowDataType@8b90ffc0
-- 8b910750 = org.h2.mvstore.db.RowDataType@8b910750
-- 8b910b12 = org.h2.mvstore.db.RowDataType@8b910b12
-- 8b94bd0a = org.h2.mvstore.db.RowDataType@8b94bd0a
-- 8b94c0c8 = org.h2.mvstore.db.RowDataType@8b94c0c8
-- 8b94c48a = org.h2.mvstore.db.RowDataType@8b94c48a
-- 8b94cc1a = org.h2.mvstore.db.RowDataType@8b94cc1a
-- 8b953527 = org.h2.mvstore.db.RowDataType@8b953527
-- 8b954079 = org.h2.mvstore.db.RowDataType@8b954079
-- 8b954437 = org.h2.mvstore.db.RowDataType@8b954437
-- 8b987692 = org.h2.mvstore.db.RowDataType@8b987692
-- 8b987a50 = org.h2.mvstore.db.RowDataType@8b987a50
-- 8b987e12 = org.h2.mvstore.db.RowDataType@8b987e12
-- 8b9881d0 = org.h2.mvstore.db.RowDataType@8b9881d0
-- 8b988592 = org.h2.mvstore.db.RowDataType@8b988592
-- 8b988960 = org.h2.mvstore.db.RowDataType@8b988960
-- 8b988d22 = org.h2.mvstore.db.RowDataType@8b988d22
-- 8b98eaf1 = org.h2.mvstore.db.RowDataType@8b98eaf1
-- 8b98eeaf = org.h2.mvstore.db.RowDataType@8b98eeaf
-- 8b98f271 = org.h2.mvstore.db.RowDataType@8b98f271
-- 8b98f62f = org.h2.mvstore.db.RowDataType@8b98f62f
-- 8b98f9f1 = org.h2.mvstore.db.RowDataType@8b98f9f1
-- 8b98fdbf = org.h2.mvstore.db.RowDataType@8b98fdbf
-- 8b990181 = org.h2.mvstore.db.RowDataType@8b990181
-- 8b995f50 = org.h2.mvstore.db.RowDataType@8b995f50
-- 8b99630e = org.h2.mvstore.db.RowDataType@8b99630e
-- 8b9966d0 = org.h2.mvstore.db.RowDataType@8b9966d0
-- 8b996a8e = org.h2.mvstore.db.RowDataType@8b996a8e
-- 8b996e50 = org.h2.mvstore.db.RowDataType@8b996e50
-- 8b99721e = org.h2.mvstore.db.RowDataType@8b99721e
-- 8b9975e0 = org.h2.mvstore.db.RowDataType@8b9975e0
-- 8b99d3af = org.h2.mvstore.db.RowDataType@8b99d3af
-- 8b99d76d = org.h2.mvstore.db.RowDataType@8b99d76d
-- 8b99db2f = org.h2.mvstore.db.RowDataType@8b99db2f
-- 8b99deed = org.h2.mvstore.db.RowDataType@8b99deed
-- 8b99e2af = org.h2.mvstore.db.RowDataType@8b99e2af
-- 8b99e67d = org.h2.mvstore.db.RowDataType@8b99e67d
-- 8b99ea3f = org.h2.mvstore.db.RowDataType@8b99ea3f
-- 8b9a480e = org.h2.mvstore.db.RowDataType@8b9a480e
-- 8b9a4bcc = org.h2.mvstore.db.RowDataType@8b9a4bcc
-- 8b9a4f8e = org.h2.mvstore.db.RowDataType@8b9a4f8e
-- 8b9a534c = org.h2.mvstore.db.RowDataType@8b9a534c
-- 8b9a570e = org.h2.mvstore.db.RowDataType@8b9a570e
-- 8b9a5adc = org.h2.mvstore.db.RowDataType@8b9a5adc
-- 8b9a5e9e = org.h2.mvstore.db.RowDataType@8b9a5e9e
-- 8b9abc6d = org.h2.mvstore.db.RowDataType@8b9abc6d
-- 8b9ac02b = org.h2.mvstore.db.RowDataType@8b9ac02b
-- 8b9ac3ed = org.h2.mvstore.db.RowDataType@8b9ac3ed
-- 8b9ac7ab = org.h2.mvstore.db.RowDataType@8b9ac7ab
-- 8b9acb6d = org.h2.mvstore.db.RowDataType@8b9acb6d
-- 8b9acf3b = org.h2.mvstore.db.RowDataType@8b9acf3b
-- 8b9ad2fd = org.h2.mvstore.db.RowDataType@8b9ad2fd
-- 8b9b30cc = org.h2.mvstore.db.RowDataType@8b9b30cc
-- 8b9b348a = org.h2.mvstore.db.RowDataType@8b9b348a
-- 8b9b384c = org.h2.mvstore.db.RowDataType@8b9b384c
-- 8b9b3c0a = org.h2.mvstore.db.RowDataType@8b9b3c0a
-- 8b9b3fcc = org.h2.mvstore.db.RowDataType@8b9b3fcc
-- 8b9b439a = org.h2.mvstore.db.RowDataType@8b9b439a
-- 8b9b475c = org.h2.mvstore.db.RowDataType@8b9b475c
-- 8b9ba52b = org.h2.mvstore.db.RowDataType@8b9ba52b
-- 8b9ba8e9 = org.h2.mvstore.db.RowDataType@8b9ba8e9
-- 8b9bacab = org.h2.mvstore.db.RowDataType@8b9bacab
-- 8b9bb069 = org.h2.mvstore.db.RowDataType@8b9bb069
-- 8b9bb42b = org.h2.mvstore.db.RowDataType@8b9bb42b
-- 8b9bb7f9 = org.h2.mvstore.db.RowDataType@8b9bb7f9
-- 8b9bbbbb = org.h2.mvstore.db.RowDataType@8b9bbbbb
-- 8b9c198a = org.h2.mvstore.db.RowDataType@8b9c198a
-- 8b9c1d48 = org.h2.mvstore.db.RowDataType@8b9c1d48
-- 8b9c210a = org.h2.mvstore.db.RowDataType@8b9c210a
-- 8b9c24c8 = org.h2.mvstore.db.RowDataType@8b9c24c8
-- 8b9c288a = org.h2.mvstore.db.RowDataType@8b9c288a
-- 8b9c2c58 = org.h2.mvstore.db.RowDataType@8b9c2c58
-- 8b9c301a = org.h2.mvstore.db.RowDataType@8b9c301a
-- 8b9c8de9 = org.h2.mvstore.db.RowDataType@8b9c8de9
-- 8b9c91a7 = org.h2.mvstore.db.RowDataType@8b9c91a7
-- 8b9c9569 = org.h2.mvstore.db.RowDataType@8b9c9569
-- 8b9c9927 = org.h2.mvstore.db.RowDataType@8b9c9927
-- 8b9c9ce9 = org.h2.mvstore.db.RowDataType@8b9c9ce9
-- 8b9ca0b7 = org.h2.mvstore.db.RowDataType@8b9ca0b7
-- 8b9ca479 = org.h2.mvstore.db.RowDataType@8b9ca479
-- 8b9ca837 = org.h2.mvstore.db.RowDataType@8b9ca837
-- 8b9cabf9 = org.h2.mvstore.db.RowDataType@8b9cabf9
-- 8b9cafb7 = org.h2.mvstore.db.RowDataType@8b9cafb7
-- 8b9cb379 = org.h2.mvstore.db.RowDataType@8b9cb379
-- 8b9cbec7 = org.h2.mvstore.db.RowDataType@8b9cbec7
-- 8b9cc647 = org.h2.mvstore.db.RowDataType@8b9cc647
-- 8b9d0248 = org.h2.mvstore.db.RowDataType@8b9d0248
-- 8b9d0606 = org.h2.mvstore.db.RowDataType@8b9d0606
-- 8b9d09c8 = org.h2.mvstore.db.RowDataType@8b9d09c8
-- 8b9d0d86 = org.h2.mvstore.db.RowDataType@8b9d0d86
-- 8b9d1148 = org.h2.mvstore.db.RowDataType@8b9d1148
-- 8b9d1516 = org.h2.mvstore.db.RowDataType@8b9d1516
-- 8b9d18d8 = org.h2.mvstore.db.RowDataType@8b9d18d8
-- 8b9d3e45 = org.h2.mvstore.db.RowDataType@8b9d3e45
-- 8b9d45c5 = org.h2.mvstore.db.RowDataType@8b9d45c5
-- 8b9d5117 = org.h2.mvstore.db.RowDataType@8b9d5117
-- 8b9d76a7 = org.h2.mvstore.db.RowDataType@8b9d76a7
-- 8b9d7a65 = org.h2.mvstore.db.RowDataType@8b9d7a65
-- 8b9d7e27 = org.h2.mvstore.db.RowDataType@8b9d7e27
-- 8b9d81e5 = org.h2.mvstore.db.RowDataType@8b9d81e5
-- 8b9d85a7 = org.h2.mvstore.db.RowDataType@8b9d85a7
-- 8b9d8975 = org.h2.mvstore.db.RowDataType@8b9d8975
-- 8b9d8d37 = org.h2.mvstore.db.RowDataType@8b9d8d37
-- 8b9da785 = org.h2.mvstore.db.RowDataType@8b9da785
-- 8b9deb06 = org.h2.mvstore.db.RowDataType@8b9deb06
-- 8b9deec4 = org.h2.mvstore.db.RowDataType@8b9deec4
-- 8b9df286 = org.h2.mvstore.db.RowDataType@8b9df286
-- 8b9df644 = org.h2.mvstore.db.RowDataType@8b9df644
-- 8b9dfa06 = org.h2.mvstore.db.RowDataType@8b9dfa06
-- 8b9dfdd4 = org.h2.mvstore.db.RowDataType@8b9dfdd4
-- 8b9e0196 = org.h2.mvstore.db.RowDataType@8b9e0196
-- 8b9e5f65 = org.h2.mvstore.db.RowDataType@8b9e5f65
-- 8b9e6323 = org.h2.mvstore.db.RowDataType@8b9e6323
-- 8b9e66e5 = org.h2.mvstore.db.RowDataType@8b9e66e5
-- 8b9e6aa3 = org.h2.mvstore.db.RowDataType@8b9e6aa3
-- 8b9e6e65 = org.h2.mvstore.db.RowDataType@8b9e6e65
-- 8b9e7233 = org.h2.mvstore.db.RowDataType@8b9e7233
-- 8b9e75f5 = org.h2.mvstore.db.RowDataType@8b9e75f5
-- 8b9ed3c4 = org.h2.mvstore.db.RowDataType@8b9ed3c4
-- 8b9ed782 = org.h2.mvstore.db.RowDataType@8b9ed782
-- 8b9edb44 = org.h2.mvstore.db.RowDataType@8b9edb44
-- 8b9edf02 = org.h2.mvstore.db.RowDataType@8b9edf02
-- 8b9ee2c4 = org.h2.mvstore.db.RowDataType@8b9ee2c4
-- 8b9ee692 = org.h2.mvstore.db.RowDataType@8b9ee692
-- 8b9eea54 = org.h2.mvstore.db.RowDataType@8b9eea54
-- 8b9f4823 = org.h2.mvstore.db.RowDataType@8b9f4823
-- 8b9f4be1 = org.h2.mvstore.db.RowDataType@8b9f4be1
-- 8b9f4fa3 = org.h2.mvstore.db.RowDataType@8b9f4fa3
-- 8b9f5361 = org.h2.mvstore.db.RowDataType@8b9f5361
-- 8b9f5723 = org.h2.mvstore.db.RowDataType@8b9f5723
-- 8b9f5af1 = org.h2.mvstore.db.RowDataType@8b9f5af1
-- 8b9f5eb3 = org.h2.mvstore.db.RowDataType@8b9f5eb3
-- 8b9fbc82 = org.h2.mvstore.db.RowDataType@8b9fbc82
-- 8b9fc040 = org.h2.mvstore.db.RowDataType@8b9fc040
-- 8b9fc402 = org.h2.mvstore.db.RowDataType@8b9fc402
-- 8b9fc7c0 = org.h2.mvstore.db.RowDataType@8b9fc7c0
-- 8b9fcb82 = org.h2.mvstore.db.RowDataType@8b9fcb82
-- 8b9fcf50 = org.h2.mvstore.db.RowDataType@8b9fcf50
-- 8b9fd312 = org.h2.mvstore.db.RowDataType@8b9fd312
-- 8ba030e1 = org.h2.mvstore.db.RowDataType@8ba030e1
-- 8ba0349f = org.h2.mvstore.db.RowDataType@8ba0349f
-- 8ba03861 = org.h2.mvstore.db.RowDataType@8ba03861
-- 8ba03c1f = org.h2.mvstore.db.RowDataType@8ba03c1f
-- 8ba03fe1 = org.h2.mvstore.db.RowDataType@8ba03fe1
-- 8ba043af = org.h2.mvstore.db.RowDataType@8ba043af
-- 8ba04771 = org.h2.mvstore.db.RowDataType@8ba04771
-- 8ba0a540 = org.h2.mvstore.db.RowDataType@8ba0a540
-- 8ba0a8fe = org.h2.mvstore.db.RowDataType@8ba0a8fe
-- 8ba0acc0 = org.h2.mvstore.db.RowDataType@8ba0acc0
-- 8ba0b07e = org.h2.mvstore.db.RowDataType@8ba0b07e
-- 8ba0b440 = org.h2.mvstore.db.RowDataType@8ba0b440
-- 8ba0b80e = org.h2.mvstore.db.RowDataType@8ba0b80e
-- 8ba0bbd0 = org.h2.mvstore.db.RowDataType@8ba0bbd0
-- 8ba1199f = org.h2.mvstore.db.RowDataType@8ba1199f
-- 8ba11d5d = org.h2.mvstore.db.RowDataType@8ba11d5d
-- 8ba1211f = org.h2.mvstore.db.RowDataType@8ba1211f
-- 8ba124dd = org.h2.mvstore.db.RowDataType@8ba124dd
-- 8ba1289f = org.h2.mvstore.db.RowDataType@8ba1289f
-- 8ba12c6d = org.h2.mvstore.db.RowDataType@8ba12c6d
-- 8ba1302f = org.h2.mvstore.db.RowDataType@8ba1302f
-- 8ba1700d = org.h2.mvstore.db.RowDataType@8ba1700d
-- 8bacd9a8 = org.h2.mvstore.db.RowDataType@8bacd9a8
-- 8beec546 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 8fa25204 = org.h2.mvstore.type.LongDataType@8fa25204
-- 8fe3ba1c = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 915e803b = org.h2.mvstore.tx.VersionedValueType@915e803b
-- 94c2867e = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 96016dde = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 96ea5734 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 98921cf5 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 999f49f0 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 9d3e8bf5 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 9dd83621 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- 9efb620e = org.h2.mvstore.tx.VersionedValueType@9efb620e
-- a1d11709 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- a29eff1c = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- a2fd44e4 = org.h2.mvstore.tx.VersionedValueType@a2fd44e4
-- a3d07edf = org.h2.mvstore.tx.VersionedValueType@a3d07edf
-- a4450460 = org.h2.mvstore.tx.VersionedValueType@a4450460
-- a47dc3d7 = org.h2.mvstore.tx.VersionedValueType@a47dc3d7
-- a4ba2351 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- a59aa1af = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- a6113702 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- a6913b43 = org.h2.mvstore.tx.VersionedValueType@a6913b43
-- a7c220e9 = org.h2.mvstore.tx.VersionedValueType@a7c220e9
-- ab1b798d = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- ac2fc060 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- ad369c5b = org.h2.mvstore.tx.VersionedValueType@ad369c5b
-- ae458082 = org.h2.mvstore.tx.VersionedValueType@ae458082
-- af0e2d85 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- b09f34b8 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- b0c98608 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- b0f0d022 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- b163aca2 = org.h2.mvstore.tx.VersionedValueType@b163aca2
-- b3c9511c = org.h2.mvstore.tx.VersionedValueType@b3c9511c
-- b47c8f0b = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- b66161a2 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- b96b18b0 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- ba2e5b60 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- bb171e2f = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- bbc822d2 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- bd395d4d = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- be2d3d46 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- bebc6e01 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- c1843c96 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- c3d49c0e = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- c5dc8acc = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- c6821c16 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- c691b189 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- c6a36c75 = org.h2.mvstore.tx.VersionedValueType@c6a36c75
-- c6defea = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- c805a7f = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- ca08795 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- ca657995 = org.h2.mvstore.tx.VersionedValueType@ca657995
-- caf1dec9 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- cb186360 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- cd53603a = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- d09af24b = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- d11a8faa = org.h2.mvstore.tx.VersionedValueType@d11a8faa
-- d131f41a = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- d18848c4 = org.h2.mvstore.tx.VersionedValueType@d18848c4
-- d1f88bca = org.h2.mvstore.tx.VersionedValueType@d1f88bca
-- d45a780a = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- d4d8db00 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- d7ffc8f8 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- d9566284 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- d99b0afb = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- d9bbd711 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- da7f1447 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- dace3871 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- db219862 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- e13c86bc = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- e1a150c = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- e4236642 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- e497a19 = org.h2.mvstore.tx.VersionedValueType@e497a19
-- e59b9101 = org.h2.mvstore.tx.VersionedValueType@e59b9101
-- e8be8f0b = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- e98afeb5 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- eabe0274 = org.h2.mvstore.db.LobStorageMap$BlobReference$Type@eabe0274
-- efc81315 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- f03c2c1e = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- f248dd21 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- f25aa7b7 = org.h2.mvstore.tx.VersionedValueType@f25aa7b7
-- f3924bb1 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- f4470498 = org.h2.mvstore.db.LobStorageMap$BlobMeta$Type@f4470498
-- f449929 = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- f54c0b7d = org.h2.mvstore.tx.VersionedValueType@f54c0b7d
-- f6fb5081 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- fc8de153 = org.h2.mvstore.tx.VersionedValueType@fc8de153
-- fd1b3e07 = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- fd5ed61c = org.h2.mvstore.tx.VersionedValueType@8e26a5e9
-- ff5b51f = org.h2.mvstore.db.NullValueDataType@5b1d2887
-- Tables
---- Schema SET ----
SET CREATE_BUILD 232;
SET DB_CLOSE_DELAY -1;
---- Table Data ----
CREATE TABLE O_44(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR, C23 VARCHAR, C24 VARCHAR, C25 VARCHAR, C26 VARCHAR, C27 VARCHAR, C28 VARCHAR, C29 VARCHAR, C30 VARCHAR, C31 VARCHAR, C32 VARCHAR, C33 VARCHAR, C34 VARCHAR, C35 VARCHAR, C36 VARCHAR, C37 VARCHAR, C38 VARCHAR, C39 VARCHAR, C40 VARCHAR, C41 VARCHAR, C42 VARCHAR, C43 VARCHAR, C44 VARCHAR, C45 VARCHAR, C46 VARCHAR, C47 VARCHAR, C48 VARCHAR, C49 VARCHAR, C50 VARCHAR, C51 VARCHAR, C52 VARCHAR, C53 VARCHAR);
INSERT INTO O_44 VALUES(1, TIMESTAMP '2026-06-09 03:23:33.053182', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:33.906636', NULL, 1597.1748607665452, TIMESTAMP '2026-06-10 07:39:31.075454', NULL, NULL, NULL, 'nashik', 1373.6319539097144, NULL, 567700.00, NULL, NULL, TIMESTAMP '2026-06-10 09:05:00', 'POD-TRP-20260609-EBED681A', 'http://example.com/sig.jpg', '/uploads/mocked_WhatsApp Image 2026-06-09 at 6.20.59 AM.jpeg', 'pune ', NULL, TIMESTAMP '2026-06-10 05:41:54.193842', 'COMPLETED', NULL, 'TRP-20260609-EBED681A', 2, 7, 1, 8, 39, 1, NULL, '/uploads/mocked_final_invoice_TRP-20260609-EBED681A.pdf', NULL, NULL, NULL, NULL, NULL, '/uploads/mocked_final_invoice_TRP-20260609-EBED681A.pdf', 'https://res.cloudinary.com/test/image/upload/v1234567890/e2e_pickup_receipt_test.jpg', '/uploads/mocked_WhatsApp Image 2026-06-09 at 7.32.23 AM.jpeg', NULL, NULL, NULL, NULL, NULL, TRUE, NULL, NULL, NULL);
INSERT INTO O_44 VALUES(33, TIMESTAMP '2026-06-09 11:03:52.604467', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:03:58.117233', NULL, 1154.576025370883, NULL, NULL, NULL, NULL, 'Pune', 764.6680536309494, NULL, 18000.00, NULL, NULL, TIMESTAMP '2026-07-01 10:00:00', NULL, NULL, NULL, 'Mumbai', NULL, NULL, 'ASSIGNED', NULL, 'TRP-20260609-5B2D3EFD', 34, 135, 34, 3, 4, 2, NULL, '/uploads/mocked_trip_TRP-20260609-5B2D3EFD.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, NULL, NULL, NULL);
INSERT INTO O_44 VALUES(65, TIMESTAMP '2026-06-09 11:17:51.140516', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:13:03.390299', NULL, 476.10763613392965, NULL, NULL, NULL, NULL, 'Pune', 1023.8413675838482, NULL, 18000.00, NULL, NULL, TIMESTAMP '2026-07-01 10:00:00', NULL, NULL, NULL, 'Mumbai', NULL, TIMESTAMP '2026-06-09 13:13:03.387314', 'STARTED', NULL, 'TRP-20260609-692BDF7F', 65, 2, 65, 3, 4, 66, NULL, '/uploads/mocked_trip_TRP-20260609-692BDF7F.pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, FALSE, NULL, NULL, NULL);
CREATE TABLE O_136(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR, C23 VARCHAR, C24 VARCHAR, C25 VARCHAR, C26 VARCHAR);
INSERT INTO O_136 VALUES(1, TIMESTAMP '2026-06-08 04:45:26.913106', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 04:45:26.913106', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 5, 'DRIVER', 'WALDR53268985EC2', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(2, TIMESTAMP '2026-06-08 04:47:24.949077', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 04:47:24.949077', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 6, 'DRIVER', 'WALDR6444948C6C1', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(3, TIMESTAMP '2026-06-08 06:42:45.687817', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 06:42:45.687817', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 7, 'DRIVER', 'WALDR7365678AC84', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(4, TIMESTAMP '2026-06-08 06:44:48.133992', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 06:44:48.133992', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 8, 'SHIPPER', 'WALSH8488133077A', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(5, TIMESTAMP '2026-06-08 06:46:57.191039', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 06:46:57.191039', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 9, 'TRANSPORTER', 'WALTR96171910657', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(35, TIMESTAMP '2026-06-08 07:59:19.172474', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:33.919026', NULL, 1703100.00, 0, 100000.00, 0.00, NULL, FALSE, TIMESTAMP '2026-06-10 07:39:31.172917', 0.00, 1703100.00, 0.00, 0.00, 50000.00, NULL, NULL, 39, 'TRANSPORTER', 'WALTR399591654E46', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(67, TIMESTAMP '2026-06-08 08:39:30.240207', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:39:30.240207', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 71, 'DRIVER', 'WALDR71370233AB8B', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(68, TIMESTAMP '2026-06-08 08:43:12.983548', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:43:12.983548', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 72, 'DRIVER', 'WALDR72592981135C', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(69, TIMESTAMP '2026-06-08 08:44:10.208668', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:44:10.208668', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 73, 'DRIVER', 'WALDR736502088E33', NULL, 'ACTIVE');
INSERT INTO O_136 VALUES(99, TIMESTAMP '2026-06-10 04:12:54.263254', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:12:54.263254', NULL, 0.00, 0, 100000.00, 0.00, NULL, FALSE, NULL, 0.00, 0.00, 0.00, 0.00, 50000.00, NULL, NULL, 167, 'DRIVER', 'WALDR167174240639B', NULL, 'ACTIVE');
CREATE TABLE O_71(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR);
INSERT INTO O_71 VALUES(1, TIMESTAMP '2026-06-09 00:31:36.174931', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 03:23:35.816045', NULL, 567900.00, NULL, NULL, 'REJECTED', NULL, 1, 39);
INSERT INTO O_71 VALUES(2, TIMESTAMP '2026-06-09 02:30:13.112208', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 03:23:28.568957', NULL, 567700.00, NULL, NULL, 'ACCEPTED', NULL, 1, 39);
INSERT INTO O_71 VALUES(33, TIMESTAMP '2026-06-09 11:03:22.072179', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:03:22.073186', NULL, 18000.00, 'Best price', NULL, 'PENDING', NULL, 33, 4);
INSERT INTO O_71 VALUES(34, TIMESTAMP '2026-06-09 11:03:48.781012', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:03:48.837436', NULL, 18000.00, 'Best price', NULL, 'ACCEPTED', NULL, 34, 4);
INSERT INTO O_71 VALUES(65, TIMESTAMP '2026-06-09 11:17:47.863515', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:17:47.982509', NULL, 18000.00, 'Best price', NULL, 'ACCEPTED', NULL, 65, 4);
CREATE TABLE O_75(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR);
INSERT INTO O_75 VALUES(1, TIMESTAMP '2026-06-08 09:05:18.934682', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:33.905171', NULL, 567800.00, '', 'nashik', TRUE, 'Construction', TIMESTAMP '2026-06-10 09:05:00', 'pune ', 'COMPLETED', 56.0, 8, 39);
INSERT INTO O_75 VALUES(33, TIMESTAMP '2026-06-09 11:03:21.939026', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:03:21.939026', NULL, 20000.00, NULL, 'Pune', TRUE, 'Steel', TIMESTAMP '2026-07-01 10:00:00', 'Mumbai', 'PENDING', 15.0, 3, NULL);
INSERT INTO O_75 VALUES(34, TIMESTAMP '2026-06-09 11:03:48.717169', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:03:54.929173', NULL, 20000.00, NULL, 'Pune', TRUE, 'Steel', TIMESTAMP '2026-07-01 10:00:00', 'Mumbai', 'ASSIGNED', 15.0, 3, 4);
INSERT INTO O_75 VALUES(65, TIMESTAMP '2026-06-09 11:17:47.755015', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:17:53.822282', NULL, 20000.00, NULL, 'Pune', TRUE, 'Steel', TIMESTAMP '2026-07-01 10:00:00', 'Mumbai', 'ASSIGNED', 15.0, 3, 4);
CREATE TABLE O_4(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR);
INSERT INTO O_4 VALUES(-1, NULL, '<< Flyway Schema History table created >>', 'TABLE', '', NULL, 'SA', TIMESTAMP '2026-06-07 07:16:04.090935', 0, TRUE);
INSERT INTO O_4 VALUES(1, '1', 'baseline', 'SQL', 'V1__baseline.sql', 669930185, 'SA', TIMESTAMP '2026-06-07 07:16:04.149006', 7, TRUE);
INSERT INTO O_4 VALUES(2, '4', 'Enterprise Features', 'SQL', 'V4__Enterprise_Features.sql', -312438317, 'SA', TIMESTAMP '2026-06-07 07:16:04.174534', 13, TRUE);
INSERT INTO O_4 VALUES(3, '5', 'Optimization', 'SQL', 'V5__Optimization.sql', 900287200, 'SA', TIMESTAMP '2026-06-07 07:16:04.191282', 7, TRUE);
INSERT INTO O_4 VALUES(4, '6', 'driver assignment receipt verification', 'SQL', 'V6__driver_assignment_receipt_verification.sql', -1558125528, 'SA', TIMESTAMP '2026-06-08 23:06:18.647056', 118, TRUE);
INSERT INTO O_4 VALUES(5, '7', 'fix vehicle available', 'SQL', 'V7__fix_vehicle_available.sql', -28526595, 'SA', TIMESTAMP '2026-06-09 10:52:03.072177', 20, TRUE);
INSERT INTO O_4 VALUES(6, '8', 'update trip status enum', 'SQL', 'V8__update_trip_status_enum.sql', 1730786727, 'SA', TIMESTAMP '2026-06-09 12:07:20.351498', 61, TRUE);
INSERT INTO O_4 VALUES(7, '9', 'route intelligence and workflow', 'SQL', 'V9__route_intelligence_and_workflow.sql', -221360657, 'SA', TIMESTAMP '2026-06-10 04:07:55.965306', 204, TRUE);
INSERT INTO O_4 VALUES(8, '10', 'full workflow columns', 'SQL', 'V10__full_workflow_columns.sql', 164090719, 'SA', TIMESTAMP '2026-06-10 04:07:56.051831', 71, TRUE);
INSERT INTO O_4 VALUES(9, '11', 'add trip photos and audit', 'SQL', 'V11__add_trip_photos_and_audit.sql', 1888589215, 'SA', TIMESTAMP '2026-06-10 07:26:58.885202', 99, TRUE);
CREATE TABLE O_128(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR, C23 VARCHAR, C24 VARCHAR, C25 VARCHAR, C26 VARCHAR, C27 VARCHAR, C28 VARCHAR, C29 VARCHAR, C30 VARCHAR, C31 VARCHAR, C32 VARCHAR, C33 VARCHAR, C34 VARCHAR, C35 VARCHAR, C36 VARCHAR, C37 VARCHAR, C38 VARCHAR, C39 VARCHAR, C40 VARCHAR, C41 VARCHAR, C42 VARCHAR, C43 VARCHAR, C44 VARCHAR, C45 VARCHAR);
INSERT INTO O_128 VALUES(1, TIMESTAMP '2026-06-07 07:16:16.389321', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:25:35.103492', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'admin@truckmitra.com', TRUE, NULL, 0, 'Super Admin', NULL, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, NULL, TIMESTAMP '2026-06-12 02:25:35.100506', '0:0:0:0:0:0:0:1', NULL, NULL, '9999999999', 0, '$2a$10$JABrvHl4X9NW4LJt/3G4cuv4b0d81Ze6mcP9iPIpz4hwOWzKE4nGC', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-07 07:16:16.336249', NULL, 'ADMIN', TRUE, NULL, TIMESTAMP '2026-06-07 07:16:16.336249', 0);
INSERT INTO O_128 VALUES(2, TIMESTAMP '2026-06-07 07:16:16.651827', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:12:13.399485', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'driver@test.com', TRUE, NULL, 0, 'Test Driver', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL, TIMESTAMP '2026-06-09 13:12:13.390504', '0:0:0:0:0:0:0:1', NULL, NULL, '8888888888', 0, '$2a$10$A.yRTeCzbJWSDB9tNmo16eGQdSolflc6mcsTYe5CoZHbP04Qu33sG', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-07 07:16:16.636178', NULL, 'DRIVER', TRUE, NULL, NULL, NULL);
INSERT INTO O_128 VALUES(3, TIMESTAMP '2026-06-07 07:16:16.846649', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:17:47.544835', NULL, 'PENDING_VERIFICATION', NULL, NULL, NULL, NULL, 'shipper@test.com', TRUE, NULL, 0, 'Test Shipper', NULL, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, NULL, TIMESTAMP '2026-06-09 11:17:47.526363', '0:0:0:0:0:0:0:1', NULL, NULL, '7777777777', 0, '$2a$10$0TikrCSwZg93A/oCGY27f.Fr1ftgFjR0lFUVk0u7jIAwqYwcJj4u.', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-07 07:16:16.835426', NULL, 'SHIPPER', TRUE, NULL, NULL, NULL);
INSERT INTO O_128 VALUES(4, TIMESTAMP '2026-06-07 07:16:17.000023', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:45:44.911432', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'transporter@test.com', TRUE, NULL, 0, 'Test Transporter', NULL, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, NULL, TIMESTAMP '2026-06-09 11:45:44.907665', '0:0:0:0:0:0:0:1', NULL, NULL, '6666666666', 0, '$2a$10$y9A3aG.2uhNsgDoXH/4eEueGsDzSfncpSWNtgbo8zRMkXpFzgLMse', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-07 07:16:16.993042', NULL, 'TRANSPORTER', TRUE, NULL, NULL, NULL);
INSERT INTO O_128 VALUES(5, TIMESTAMP '2026-06-08 04:45:26.393319', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 07:14:10.081385', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'drivernew@test.com', TRUE, NULL, 0, 'New Driver', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL, TIMESTAMP '2026-06-08 07:14:10.015988', '0:0:0:0:0:0:0:1', NULL, NULL, '9000000000', 0, '$2a$10$m/ElNcmmcjylu7FU8J2ElOTDSVBCULaLTyACw5TR.wJzRTnMRYA2q', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 04:45:26.283401', '0:0:0:0:0:0:0:1', 'DRIVER', TRUE, NULL, NULL, NULL);
INSERT INTO O_128 VALUES(6, TIMESTAMP '2026-06-08 04:47:24.855281', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 04:47:24.855803', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'Case@Test.com', TRUE, NULL, 0, 'New Driver', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL, NULL, NULL, NULL, NULL, '9000000001', 0, '$2a$10$WHR4CONwqNukM1l/HDP.yO8oJNqHgEhQuXD80lHVQ/Y84gVs7prEy', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 04:47:24.85423', '0:0:0:0:0:0:0:1', 'DRIVER', TRUE, NULL, NULL, NULL);
INSERT INTO O_128 VALUES(7, TIMESTAMP '2026-06-08 06:42:45.636913', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:33.905171', NULL, 'VERIFIED', 'nashik', 'civil hospital', 'nashik', NULL, 'snehal@gmail.com', TRUE, NULL, 0, 'snehal patil', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, 'bus stand', TIMESTAMP '2026-06-10 05:45:21.410719', '0:0:0:0:0:0:0:1', NULL, NULL, '9087656789', 0, '$2a$10$C8mEBpxQp.kvw4lgivA2xOSdpmdRIL3QjiF8eQAnZQh9mo6f092H6', '420009', NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 06:42:45.632922', '0:0:0:0:0:0:0:1', 'DRIVER', TRUE, 'Maharashtra', TIMESTAMP '2026-06-08 08:46:04.282816', 1);
INSERT INTO O_128 VALUES(8, TIMESTAMP '2026-06-08 06:44:48.102141', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 03:17:23.165895', NULL, 'VERIFIED', 'pune', '', 'pune', NULL, 'ankita@gmail.com', TRUE, NULL, 0, 'ankita patel', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, 'ddy', TIMESTAMP '2026-06-09 03:17:23.093241', '0:0:0:0:0:0:0:1', NULL, NULL, '9900776655', 0, '$2a$10$ap0sgY0Yh8wkPK/Nz3Nezesh3Caa2.LGET8nyAS8zcCUajUA6MVCq', '420001', NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 06:44:48.091079', '0:0:0:0:0:0:0:1', 'SHIPPER', TRUE, 'Maharashtra', TIMESTAMP '2026-06-08 08:46:22.445308', 1);
INSERT INTO O_128 VALUES(9, TIMESTAMP '2026-06-08 06:46:57.164414', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:49:06.353322', NULL, 'VERIFIED', 'nashik', '', 'nashik', NULL, 'purva@gmail.com', TRUE, NULL, 0, 'purva shimpi', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, 'saraf lawns', TIMESTAMP '2026-06-08 08:49:06.351269', '0:0:0:0:0:0:0:1', NULL, NULL, '7890564321', 0, '$2a$10$yrnYw/aphAGL/6YlD0uFuutWzaazZHWqBaLZcrvDVMMOcF7W66pBy', '420009', NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 06:46:57.157432', '0:0:0:0:0:0:0:1', 'TRANSPORTER', TRUE, 'Maharashtra', TIMESTAMP '2026-06-08 08:46:27.303954', 1);
INSERT INTO O_128 VALUES(39, TIMESTAMP '2026-06-08 07:59:19.151326', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:50:02.726717', NULL, 'VERIFIED', 'nashik', '', 'nashik', NULL, 'poonam@gmail.com', TRUE, NULL, 0, 'poonam ', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, TRUE, 'bus stop', TIMESTAMP '2026-06-10 07:50:02.724564', '0:0:0:0:0:0:0:1', NULL, NULL, '9087656009', 0, '$2a$10$6.WYks6r/eDe5MCJGxoGB.qwT44p9G/FKCbr6bjCT3G5wbzYHcs/i', '420009', NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 07:59:19.139645', '0:0:0:0:0:0:0:1', 'TRANSPORTER', TRUE, 'Maharashtra', TIMESTAMP '2026-06-08 08:46:29.412373', 1);
INSERT INTO O_128 VALUES(71, TIMESTAMP '2026-06-08 08:39:30.216973', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:39:30.632737', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'driver_9414535788@test.com', TRUE, NULL, 0, 'Test Integration Driver', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL, TIMESTAMP '2026-06-08 08:39:30.628847', '0:0:0:0:0:0:0:1', NULL, NULL, '9414535788', 0, '$2a$10$SG1UBeAnyzPmILzMDj9FkuZJtYRyOcWHBEkR07ooq4BUq2I5VuYLy', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 08:39:30.216973', '0:0:0:0:0:0:0:1', 'DRIVER', TRUE, NULL, NULL, NULL);
INSERT INTO O_128 VALUES(72, TIMESTAMP '2026-06-08 08:43:12.96949', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:43:13.606642', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'driver_9862945448@test.com', TRUE, NULL, 0, 'Test Integration Driver', NULL, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, NULL, TIMESTAMP '2026-06-08 08:43:13.241725', '0:0:0:0:0:0:0:1', NULL, NULL, '9862945448', 0, '$2a$10$R3oYuGJraBBOqEIhSkn8COQlN.bNKE.skIUB2qecken96EDss676O', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 08:43:12.96949', '0:0:0:0:0:0:0:1', 'DRIVER', TRUE, NULL, NULL, NULL);
INSERT INTO O_128 VALUES(73, TIMESTAMP '2026-06-08 08:44:10.145807', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:44:11.530748', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'driver_9494882565@test.com', TRUE, NULL, 0, 'Test Integration Driver', NULL, FALSE, FALSE, FALSE, TRUE, TRUE, TRUE, NULL, TIMESTAMP '2026-06-08 08:44:10.488901', '0:0:0:0:0:0:0:1', NULL, NULL, '9494882565', 0, '$2a$10$V1pgs8yeUygQ2rzeZICmDeqkTw3rBFoUHdZcFRXRaCp3SHdapu6Dm', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-08 08:44:10.144807', '0:0:0:0:0:0:0:1', 'DRIVER', TRUE, NULL, TIMESTAMP '2026-06-08 08:44:11.412263', 1);
INSERT INTO O_128 VALUES(135, TIMESTAMP '2026-06-09 07:24:59.844805', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:03:58.110349', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'snehal1781004299748@e2e.com', TRUE, NULL, 0, 'Snehal E2E 1781004299748', NULL, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, NULL, NULL, NULL, NULL, NULL, '8888299748', 0, 'password123', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, NULL, NULL, 'DRIVER', TRUE, NULL, NULL, NULL);
INSERT INTO O_128 VALUES(167, TIMESTAMP '2026-06-10 04:12:54.218099', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:23:59.280954', NULL, 'VERIFIED', NULL, NULL, NULL, NULL, 'e2edriver@test.com', TRUE, NULL, 0, 'Test Driver E2E', NULL, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, NULL, TIMESTAMP '2026-06-10 04:23:59.254754', '0:0:0:0:0:0:0:1', NULL, NULL, '9800000099', 0, '$2a$10$630uLQgGHoa2GLXM/lNxO.ebLzO92XigIXngoz3uha1czc6utjAoa', NULL, NULL, 'EMAIL_PASSWORD', NULL, TRUE, NULL, TIMESTAMP '2026-06-10 04:12:54.196019', '0:0:0:0:0:0:0:1', 'DRIVER', TRUE, NULL, NULL, NULL);
CREATE TABLE O_124(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR);
INSERT INTO O_124 VALUES(1, TRUE, TIMESTAMP '2026-07-09 11:35:32.804', TIMESTAMP '2026-06-09 11:35:32.804', 'ACTIVE', 1, 4);
INSERT INTO O_124 VALUES(2, TRUE, TIMESTAMP '2026-07-09 11:35:32.804', TIMESTAMP '2026-06-09 11:35:32.804', 'ACTIVE', 1, 9);
INSERT INTO O_124 VALUES(3, TRUE, TIMESTAMP '2026-07-09 11:35:32.804', TIMESTAMP '2026-06-09 11:35:32.804', 'ACTIVE', 1, 39);
CREATE TABLE O_113(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR, C23 VARCHAR, C24 VARCHAR, C25 VARCHAR, C26 VARCHAR);
INSERT INTO O_113 VALUES(NULL, NULL, NULL, 'Test Agency', 0.0, 0.0, 0, NULL, 5.0, NULL, 10, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.0, 0, 1, 4);
INSERT INTO O_113 VALUES('https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924520/truckmitra/hcfdfoavokkbkfp2jkri.jpg', 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924515/truckmitra/ysi2wqyeqhjhojqcmfsp.jpg', '3505958521267', 'anu', 0.0, 0.0, 0, NULL, 5.0, 6, 5, 2, NULL, '22AAGR2345Q6', NULL, 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924502/truckmitra/aahvhs08ggvqjyngmff7.jpg', 'jxops8806W', 'india', NULL, NULL, NULL, 0, 0, 0.0, 0, 0, 9);
INSERT INTO O_113 VALUES('https://res.cloudinary.com/dmtrmiad3/image/upload/v1780928839/truckmitra/smksjat8lht9z1jaohkg.jpg', 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780928834/truckmitra/b7r5ovewosy38uusaper.jpg', '3505958521267', 'anu aa', 0.0, 0.0, 0, NULL, 5.0, 8, 6, 2, NULL, '22AAGR2345Q4', NULL, 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780928821/truckmitra/crj4umsu5np8o0rc2nil.jpg', 'jxops8806R', 'india', NULL, 'ENTERPRISE', NULL, 0, 1, 0.0, 0, 1, 39);
CREATE TABLE O_112(C0 VARCHAR, C1 VARCHAR);
INSERT INTO O_112 VALUES(39, 2);
INSERT INTO O_112 VALUES(4, 66);
CREATE TABLE O_233(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR, C23 VARCHAR, C24 VARCHAR, C25 VARCHAR, C26 VARCHAR, C27 VARCHAR);
INSERT INTO O_233 VALUES(1, TIMESTAMP '2026-06-09 06:38:31.002476', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:33.906127', NULL, 24.0, NULL, NULL, NULL, NULL, TRUE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'MH05-BH 0945', NULL, 'TRUCK', NULL, 7);
INSERT INTO O_233 VALUES(2, TIMESTAMP '2026-06-09 07:25:00.02218', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:03:55.26359', NULL, 15.0, NULL, NULL, NULL, NULL, FALSE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'MH05YZ1111', NULL, 'TRUCK', 39, 135);
INSERT INTO O_233 VALUES(66, TIMESTAMP '2026-06-09 11:45:45.276927', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:45:45.5971', NULL, 10.0, NULL, NULL, NULL, NULL, FALSE, 'TATA', 'TATA', NULL, NULL, NULL, NULL, 'RC2352', NULL, NULL, 'MH12AA2352', NULL, 'TRUCK', 4, 2);
CREATE TABLE O_111(C0 VARCHAR, C1 VARCHAR);
INSERT INTO O_111 VALUES(39, 135);
CREATE TABLE O_95(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR);
INSERT INTO O_95 VALUES(67, TIMESTAMP WITH TIME ZONE '2026-07-08 08:47:25.114399+00', '42225b27-6f71-4bd7-aca2-2f11b776ba3e', 6);
INSERT INTO O_95 VALUES(101, TIMESTAMP WITH TIME ZONE '2026-07-08 11:14:10.257189+00', '3eec3f24-d3d7-4687-b5ec-a2959caf3051', 5);
INSERT INTO O_95 VALUES(168, TIMESTAMP WITH TIME ZONE '2026-07-08 12:39:30.647859+00', '3a7a2e3b-33d5-4a38-9549-616688a64d73', 71);
INSERT INTO O_95 VALUES(170, TIMESTAMP WITH TIME ZONE '2026-07-08 12:43:13.269864+00', '2de07c62-db31-4300-9687-cd0d5c14ab35', 72);
INSERT INTO O_95 VALUES(173, TIMESTAMP WITH TIME ZONE '2026-07-08 12:44:10.513818+00', '75483071-7c6c-458f-900c-c3a8f5c5578d', 73);
INSERT INTO O_95 VALUES(178, TIMESTAMP WITH TIME ZONE '2026-07-08 12:49:06.398798+00', '41557d85-6bac-49ab-a076-8f2842990e00', 9);
INSERT INTO O_95 VALUES(650, TIMESTAMP WITH TIME ZONE '2026-07-09 15:17:47.581023+00', '6b7be47c-69c1-4c29-b664-bf75cf51e5c3', 3);
INSERT INTO O_95 VALUES(838, TIMESTAMP WITH TIME ZONE '2026-07-09 15:45:44.934442+00', '40f243f1-e2a1-4d19-bcb9-4dc41be0111b', 4);
INSERT INTO O_95 VALUES(905, TIMESTAMP WITH TIME ZONE '2026-07-09 17:12:13.697546+00', '93a23702-747c-40b5-a59a-d9c671ff35dd', 2);
INSERT INTO O_95 VALUES(967, TIMESTAMP WITH TIME ZONE '2026-07-10 08:23:59.320618+00', '40bd7665-cb5b-49ba-9129-e50c0f038803', 167);
INSERT INTO O_95 VALUES(1190, TIMESTAMP WITH TIME ZONE '2026-07-10 11:50:02.805498+00', '03f0d192-77fb-46f6-8b72-b3cb7d4c9321', 39);
INSERT INTO O_95 VALUES(1192, TIMESTAMP WITH TIME ZONE '2026-07-12 06:25:35.745853+00', 'c7c2db68-b688-4b8b-9990-b9fc1f3eb0a3', 1);
CREATE TABLE O_79(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR);
INSERT INTO O_79 VALUES(1, TIMESTAMP '2026-06-10 04:41:47.465515', 'TM-LR-2026-1-6D21D', '/uploads/mocked_lr_TM-LR-2026-1-6D21D.pdf', 'https://res.cloudinary.com/dummy/image/upload/v1234567890/mocked_qrcode_TM-LR-2026-1-6D21D.png', TIMESTAMP '2026-06-10 04:41:47.465515', 1);
CREATE TABLE O_102(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR);
INSERT INTO O_102 VALUES(1, -1, 'Advanced features for enterprise logistics', -1, TRUE, TRUE, -1, 'PRO', 4999.0);
CREATE TABLE O_83(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR);
INSERT INTO O_83 VALUES(1, TIMESTAMP '2026-06-08 08:44:11.441062', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:44:11.53942', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'driver_9494882565@test.com', 0, TIMESTAMP '2026-06-08 08:44:11.531742', 'SENT', 'TruckMitra Notification', 'notification', 73);
INSERT INTO O_83 VALUES(2, TIMESTAMP '2026-06-08 08:46:04.295782', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:46:04.354972', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 0, TIMESTAMP '2026-06-08 08:46:04.346451', 'SENT', 'TruckMitra Notification', 'notification', 7);
INSERT INTO O_83 VALUES(3, TIMESTAMP '2026-06-08 08:46:22.460744', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:46:22.478434', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 0, TIMESTAMP '2026-06-08 08:46:22.475441', 'SENT', 'TruckMitra Notification', 'notification', 8);
INSERT INTO O_83 VALUES(4, TIMESTAMP '2026-06-08 08:46:27.338629', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:46:27.357947', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'purva@gmail.com', 0, TIMESTAMP '2026-06-08 08:46:27.35695', 'SENT', 'TruckMitra Notification', 'notification', 9);
INSERT INTO O_83 VALUES(5, TIMESTAMP '2026-06-08 08:46:29.442876', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-08 08:46:29.509188', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 0, TIMESTAMP '2026-06-08 08:46:29.494237', 'SENT', 'TruckMitra Notification', 'notification', 39);
INSERT INTO O_83 VALUES(33, TIMESTAMP '2026-06-09 11:03:55.408063', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:03:55.569494', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal1781004299748@e2e.com', 1, NULL, 'RETRYING', 'New Trip Assignment', 'notification', 135);
INSERT INTO O_83 VALUES(34, TIMESTAMP '2026-06-09 11:05:13.597165', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:05:13.687577', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'New Trip Assignment', 'notification', 7);
INSERT INTO O_83 VALUES(35, TIMESTAMP '2026-06-09 11:08:55.579417', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:08:55.70173', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal1781004299748@e2e.com', 1, NULL, 'RETRYING', 'New Trip Assignment', 'notification', 135);
INSERT INTO O_83 VALUES(65, TIMESTAMP '2026-06-09 11:39:42.822551', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:39:43.039611', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(66, TIMESTAMP '2026-06-09 11:39:42.822551', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:39:43.04961', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(67, TIMESTAMP '2026-06-09 11:39:45.422482', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:39:45.488424', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(68, TIMESTAMP '2026-06-09 11:39:45.558003', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:39:45.612234', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(97, TIMESTAMP '2026-06-09 11:45:45.672405', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:45:45.848235', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'driver@test.com', 1, NULL, 'RETRYING', 'New Trip Assignment', 'notification', 2);
INSERT INTO O_83 VALUES(98, TIMESTAMP '2026-06-09 11:46:07.129769', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:46:07.168844', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(99, TIMESTAMP '2026-06-09 11:50:45.853787', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:50:45.90553', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'driver@test.com', 1, NULL, 'RETRYING', 'New Trip Assignment', 'notification', 2);
INSERT INTO O_83 VALUES(100, TIMESTAMP '2026-06-09 11:51:07.173493', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:51:07.306613', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(101, TIMESTAMP '2026-06-09 11:55:45.911792', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:55:46.051995', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'driver@test.com', 1, NULL, 'RETRYING', 'New Trip Assignment', 'notification', 2);
INSERT INTO O_83 VALUES(102, TIMESTAMP '2026-06-09 11:56:07.324008', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:56:07.482721', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(103, TIMESTAMP '2026-06-09 11:56:43.356071', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 11:56:43.439516', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(129, TIMESTAMP '2026-06-09 12:00:06.295102', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:00:10.932212', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(130, TIMESTAMP '2026-06-09 12:05:10.93861', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:05:13.62742', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(161, TIMESTAMP '2026-06-09 12:07:58.406035', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:08:02.188569', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(162, TIMESTAMP '2026-06-09 12:13:02.198895', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:13:04.809822', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(163, TIMESTAMP '2026-06-09 12:18:04.815685', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:18:07.874285', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(164, TIMESTAMP '2026-06-09 12:23:07.880442', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:23:10.501168', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(165, TIMESTAMP '2026-06-09 12:25:07.286846', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:25:10.383476', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(166, TIMESTAMP '2026-06-09 12:28:10.507179', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:28:13.60122', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(167, TIMESTAMP '2026-06-09 12:30:10.412562', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:30:13.431191', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(168, TIMESTAMP '2026-06-09 12:33:13.665938', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:33:16.386007', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(169, TIMESTAMP '2026-06-09 12:35:13.441139', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:35:15.948997', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(170, TIMESTAMP '2026-06-09 12:38:16.468796', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:38:19.583284', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(171, TIMESTAMP '2026-06-09 12:40:15.974314', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:40:18.67971', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(172, TIMESTAMP '2026-06-09 12:43:19.669663', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:43:23.227062', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(173, TIMESTAMP '2026-06-09 12:45:18.703266', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:45:21.240655', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(174, TIMESTAMP '2026-06-09 12:48:23.255014', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:48:25.838564', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(175, TIMESTAMP '2026-06-09 12:50:21.265634', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:50:24.166369', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(176, TIMESTAMP '2026-06-09 12:53:25.850984', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:53:29.260719', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(177, TIMESTAMP '2026-06-09 12:55:24.202149', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:55:27.137844', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(178, TIMESTAMP '2026-06-09 12:58:29.284353', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 12:58:31.931677', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(179, TIMESTAMP '2026-06-09 13:00:27.166079', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:00:29.974946', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(180, TIMESTAMP '2026-06-09 13:03:31.955947', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:03:34.557251', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(181, TIMESTAMP '2026-06-09 13:05:30.010337', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:05:32.865329', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(182, TIMESTAMP '2026-06-09 13:08:34.656293', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:08:37.345947', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(183, TIMESTAMP '2026-06-09 13:10:32.913799', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:10:36.647168', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(184, TIMESTAMP '2026-06-09 13:13:03.496592', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:13:06.329403', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(185, TIMESTAMP '2026-06-09 13:13:37.363092', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:13:40.56978', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(186, TIMESTAMP '2026-06-09 13:15:36.677816', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:15:39.62083', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(187, TIMESTAMP '2026-06-09 13:18:06.360347', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:18:09.679545', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(188, TIMESTAMP '2026-06-09 13:18:40.594286', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 13:18:43.613847', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(189, TIMESTAMP '2026-06-09 21:04:30.71145', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:04:31.206207', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(190, TIMESTAMP '2026-06-09 21:07:00.728182', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:07:00.963085', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(191, TIMESTAMP '2026-06-09 21:07:34.694906', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:07:34.908931', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(192, TIMESTAMP '2026-06-09 21:09:31.329407', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:09:31.505402', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(193, TIMESTAMP '2026-06-09 21:12:00.990138', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:12:01.240121', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(194, TIMESTAMP '2026-06-09 21:12:34.950435', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:12:35.223099', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(195, TIMESTAMP '2026-06-09 21:14:31.543899', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:14:34.37941', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(196, TIMESTAMP '2026-06-09 21:17:01.267119', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:17:03.898703', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(197, TIMESTAMP '2026-06-09 21:17:35.272277', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:17:44.774177', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(198, TIMESTAMP '2026-06-09 21:19:34.412726', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:19:37.468516', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(199, TIMESTAMP '2026-06-09 21:22:03.9588', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:22:06.579029', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(200, TIMESTAMP '2026-06-09 21:22:44.828256', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:22:47.529647', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(201, TIMESTAMP '2026-06-09 21:24:37.505458', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:24:41.62238', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(202, TIMESTAMP '2026-06-09 21:27:06.628234', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:27:09.378334', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(203, TIMESTAMP '2026-06-09 21:27:47.560066', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:27:50.531688', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(204, TIMESTAMP '2026-06-09 21:29:41.654739', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:29:44.129702', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(205, TIMESTAMP '2026-06-09 21:32:09.415147', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:32:12.251159', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(206, TIMESTAMP '2026-06-09 21:32:50.639253', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:32:53.392185', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(207, TIMESTAMP '2026-06-09 21:34:44.182108', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:34:47.005967', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(208, TIMESTAMP '2026-06-09 21:37:12.288294', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:37:15.073644', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(209, TIMESTAMP '2026-06-09 21:37:53.421683', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:37:56.249243', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(210, TIMESTAMP '2026-06-09 21:39:47.055866', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:39:49.784804', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(211, TIMESTAMP '2026-06-09 21:42:15.112714', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:42:17.890267', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(212, TIMESTAMP '2026-06-09 21:42:56.283366', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:42:59.137096', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(213, TIMESTAMP '2026-06-09 21:44:49.842534', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:44:52.526825', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(214, TIMESTAMP '2026-06-09 21:47:17.930052', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:47:20.699362', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(215, TIMESTAMP '2026-06-09 21:47:59.171124', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:48:02.078536', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(216, TIMESTAMP '2026-06-09 21:49:52.585501', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:49:55.218411', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(217, TIMESTAMP '2026-06-09 21:52:20.739288', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:52:23.598644', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(218, TIMESTAMP '2026-06-09 21:53:02.106713', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:53:04.891128', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(219, TIMESTAMP '2026-06-09 21:54:55.276505', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:54:57.957625', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(220, TIMESTAMP '2026-06-09 21:57:23.640258', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:57:26.380879', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(221, TIMESTAMP '2026-06-09 21:58:04.946156', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 21:58:09.131849', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(222, TIMESTAMP '2026-06-09 21:59:58.002997', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:00:00.736475', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(223, TIMESTAMP '2026-06-09 22:02:26.430427', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:02:29.276996', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(224, TIMESTAMP '2026-06-09 22:03:09.182447', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:03:11.671861', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(225, TIMESTAMP '2026-06-09 22:05:00.778153', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:05:03.315348', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(226, TIMESTAMP '2026-06-09 22:07:29.367821', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:07:31.991898', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(227, TIMESTAMP '2026-06-09 22:08:11.72221', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:08:14.3442', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(228, TIMESTAMP '2026-06-09 22:10:03.360425', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:10:06.050238', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(229, TIMESTAMP '2026-06-09 22:12:32.035908', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:12:34.617816', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(230, TIMESTAMP '2026-06-09 22:13:14.416271', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:13:17.004758', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(231, TIMESTAMP '2026-06-09 22:15:06.082311', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:15:08.701539', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(232, TIMESTAMP '2026-06-09 22:17:34.696848', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:17:37.402811', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(233, TIMESTAMP '2026-06-09 22:18:17.045058', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:18:20.017887', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(234, TIMESTAMP '2026-06-09 22:20:08.746672', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:20:11.717641', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(235, TIMESTAMP '2026-06-09 22:22:37.447914', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:22:39.886645', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(236, TIMESTAMP '2026-06-09 22:23:20.076614', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:23:22.800089', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(237, TIMESTAMP '2026-06-09 22:25:11.768611', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:25:14.370531', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(238, TIMESTAMP '2026-06-09 22:27:39.929047', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:27:42.990169', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(239, TIMESTAMP '2026-06-09 22:28:22.848907', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:28:25.664206', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(240, TIMESTAMP '2026-06-09 22:30:14.40781', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:30:17.33528', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(241, TIMESTAMP '2026-06-09 22:32:43.029034', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:32:45.855643', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(242, TIMESTAMP '2026-06-09 22:33:25.775769', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:33:28.502082', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(243, TIMESTAMP '2026-06-09 22:35:17.369386', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:35:20.448151', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(244, TIMESTAMP '2026-06-09 22:37:45.888565', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:37:48.9176', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(245, TIMESTAMP '2026-06-09 22:38:28.537494', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:38:31.247736', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(246, TIMESTAMP '2026-06-09 22:40:20.481367', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:40:23.414184', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(247, TIMESTAMP '2026-06-09 22:42:48.94364', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:43:00.280641', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(248, TIMESTAMP '2026-06-09 22:43:31.298829', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:43:34.281084', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(249, TIMESTAMP '2026-06-09 22:45:23.462926', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:45:26.295132', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(250, TIMESTAMP '2026-06-09 22:48:00.311153', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:48:03.001737', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(251, TIMESTAMP '2026-06-09 22:48:34.305721', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:48:37.490941', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(252, TIMESTAMP '2026-06-09 22:50:26.348734', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:50:29.66594', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(253, TIMESTAMP '2026-06-09 22:53:03.067962', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:53:06.438156', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(254, TIMESTAMP '2026-06-09 22:53:37.522163', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:53:40.622874', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(255, TIMESTAMP '2026-06-09 22:55:29.701467', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:55:32.669222', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(256, TIMESTAMP '2026-06-09 22:58:06.489319', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:58:09.713477', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(257, TIMESTAMP '2026-06-09 22:58:40.689158', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 22:58:43.499506', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(258, TIMESTAMP '2026-06-09 23:00:32.729535', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:00:36.299008', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(259, TIMESTAMP '2026-06-09 23:03:09.761885', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:03:12.691255', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(260, TIMESTAMP '2026-06-09 23:03:43.534472', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:03:46.280109', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(261, TIMESTAMP '2026-06-09 23:05:36.419286', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:05:39.130423', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(262, TIMESTAMP '2026-06-09 23:08:12.745312', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:08:15.67786', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(263, TIMESTAMP '2026-06-09 23:08:46.326775', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:08:49.084372', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(264, TIMESTAMP '2026-06-09 23:10:39.161976', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:10:41.977357', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(265, TIMESTAMP '2026-06-09 23:13:15.709064', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:13:18.437485', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(266, TIMESTAMP '2026-06-09 23:13:49.120233', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:13:51.976419', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(267, TIMESTAMP '2026-06-09 23:15:42.008539', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:15:44.862198', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(268, TIMESTAMP '2026-06-09 23:18:18.473137', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:18:21.347417', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(269, TIMESTAMP '2026-06-09 23:18:52.078037', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:18:54.77778', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(270, TIMESTAMP '2026-06-09 23:20:44.968563', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:20:47.713527', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(271, TIMESTAMP '2026-06-09 23:23:21.450318', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:23:25.895921', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(272, TIMESTAMP '2026-06-09 23:23:54.830651', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:23:57.974773', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(273, TIMESTAMP '2026-06-09 23:25:47.757471', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:25:50.498836', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(274, TIMESTAMP '2026-06-09 23:28:25.992509', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:28:28.793898', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(275, TIMESTAMP '2026-06-09 23:28:58.015682', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:29:04.460544', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(276, TIMESTAMP '2026-06-09 23:30:50.559197', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:30:53.269615', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(277, TIMESTAMP '2026-06-09 23:33:28.83353', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:33:31.642542', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(278, TIMESTAMP '2026-06-09 23:34:04.504575', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:34:07.472679', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(279, TIMESTAMP '2026-06-09 23:35:53.318692', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:35:56.1865', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(280, TIMESTAMP '2026-06-09 23:38:31.677006', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:38:34.766251', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(281, TIMESTAMP '2026-06-09 23:39:07.517445', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:39:10.271697', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(282, TIMESTAMP '2026-06-09 23:40:56.226401', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:40:59.218422', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(283, TIMESTAMP '2026-06-09 23:43:34.814995', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:43:37.671702', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(284, TIMESTAMP '2026-06-09 23:44:10.322588', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:44:13.088555', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(285, TIMESTAMP '2026-06-09 23:45:59.27206', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:46:02.200689', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(286, TIMESTAMP '2026-06-09 23:48:37.705617', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:48:40.458277', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(287, TIMESTAMP '2026-06-09 23:49:13.12657', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:49:16.024925', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(288, TIMESTAMP '2026-06-09 23:51:02.245237', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:51:04.737648', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(289, TIMESTAMP '2026-06-09 23:53:40.505248', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:53:43.188999', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(290, TIMESTAMP '2026-06-09 23:54:16.05969', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:54:18.958913', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(291, TIMESTAMP '2026-06-09 23:56:04.774892', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:56:07.504952', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(292, TIMESTAMP '2026-06-09 23:58:43.233395', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:58:46.141359', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(293, TIMESTAMP '2026-06-09 23:59:19.010708', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-09 23:59:21.593205', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(294, TIMESTAMP '2026-06-10 00:01:07.573898', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:01:10.254278', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(295, TIMESTAMP '2026-06-10 00:03:46.184983', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:03:48.787127', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(296, TIMESTAMP '2026-06-10 00:04:21.629968', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:04:24.512901', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(297, TIMESTAMP '2026-06-10 00:06:10.332656', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:06:13.119131', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(298, TIMESTAMP '2026-06-10 00:08:48.823443', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:08:51.701423', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(299, TIMESTAMP '2026-06-10 00:09:24.581196', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:09:27.458617', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(300, TIMESTAMP '2026-06-10 00:11:13.161269', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:11:16.237885', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(301, TIMESTAMP '2026-06-10 00:13:51.741218', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:13:54.254088', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(302, TIMESTAMP '2026-06-10 00:14:27.498565', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:14:30.341641', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(303, TIMESTAMP '2026-06-10 00:16:16.315841', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:16:19.117583', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(304, TIMESTAMP '2026-06-10 00:18:54.299192', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:18:57.382074', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(305, TIMESTAMP '2026-06-10 00:19:30.385501', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:19:33.126726', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(306, TIMESTAMP '2026-06-10 00:21:19.161285', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:21:22.225049', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(307, TIMESTAMP '2026-06-10 00:23:57.423365', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:24:00.179308', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(308, TIMESTAMP '2026-06-10 00:24:33.16681', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:24:36.056651', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(309, TIMESTAMP '2026-06-10 00:26:22.27634', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:26:25.541475', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(310, TIMESTAMP '2026-06-10 00:29:00.229975', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:29:03.39357', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(311, TIMESTAMP '2026-06-10 00:29:36.206942', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:29:39.103656', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(312, TIMESTAMP '2026-06-10 00:31:25.62411', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:31:28.482549', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(313, TIMESTAMP '2026-06-10 00:34:03.46344', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:34:08.297978', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(314, TIMESTAMP '2026-06-10 00:34:39.214002', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:34:45.141703', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(315, TIMESTAMP '2026-06-10 00:36:28.543574', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:36:31.171937', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(316, TIMESTAMP '2026-06-10 00:39:08.371009', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:39:10.940408', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(317, TIMESTAMP '2026-06-10 00:39:45.183858', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:39:47.7682', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(318, TIMESTAMP '2026-06-10 00:41:31.224334', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:41:33.785939', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(319, TIMESTAMP '2026-06-10 00:44:11.012099', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:44:13.617502', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(320, TIMESTAMP '2026-06-10 00:44:47.840337', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:44:50.400901', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(321, TIMESTAMP '2026-06-10 00:46:33.864159', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:46:36.516117', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(322, TIMESTAMP '2026-06-10 00:49:13.677811', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:49:16.18908', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(323, TIMESTAMP '2026-06-10 00:49:50.441348', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:49:52.980844', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(324, TIMESTAMP '2026-06-10 00:51:36.567017', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:51:39.267153', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(325, TIMESTAMP '2026-06-10 00:54:16.229356', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:54:19.173166', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(326, TIMESTAMP '2026-06-10 00:54:53.016599', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:54:55.48916', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(327, TIMESTAMP '2026-06-10 00:56:39.328804', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:56:42.747713', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(328, TIMESTAMP '2026-06-10 00:59:19.242567', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:59:22.906085', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(329, TIMESTAMP '2026-06-10 00:59:55.527147', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 00:59:58.107348', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(330, TIMESTAMP '2026-06-10 01:01:42.906541', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:01:45.596503', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(331, TIMESTAMP '2026-06-10 01:04:22.979611', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:04:25.543263', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(332, TIMESTAMP '2026-06-10 01:04:58.186063', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:05:00.970431', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(333, TIMESTAMP '2026-06-10 01:06:45.648441', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:06:48.507589', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(334, TIMESTAMP '2026-06-10 01:09:25.595268', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:09:28.632305', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(335, TIMESTAMP '2026-06-10 01:10:01.029406', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:10:03.599802', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(336, TIMESTAMP '2026-06-10 01:11:48.561409', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:11:51.201735', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(337, TIMESTAMP '2026-06-10 01:14:28.678002', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:14:31.451799', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(338, TIMESTAMP '2026-06-10 01:15:03.642897', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:15:06.238309', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(339, TIMESTAMP '2026-06-10 01:16:51.280127', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:16:53.970493', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(340, TIMESTAMP '2026-06-10 01:19:31.520215', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:19:36.168396', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(341, TIMESTAMP '2026-06-10 01:20:06.279876', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:20:09.07932', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(342, TIMESTAMP '2026-06-10 01:21:54.01753', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:21:57.219151', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(343, TIMESTAMP '2026-06-10 01:24:36.214935', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:24:39.108547', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(344, TIMESTAMP '2026-06-10 01:25:09.15546', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:25:11.864911', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(345, TIMESTAMP '2026-06-10 01:26:57.262985', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:26:59.911239', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(346, TIMESTAMP '2026-06-10 01:29:39.169992', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:29:42.0524', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(347, TIMESTAMP '2026-06-10 01:30:11.943253', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:30:14.90522', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(348, TIMESTAMP '2026-06-10 01:31:59.998449', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:32:02.579894', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(349, TIMESTAMP '2026-06-10 01:34:42.107635', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:34:44.787331', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(350, TIMESTAMP '2026-06-10 01:35:14.95081', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:35:18.459537', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(351, TIMESTAMP '2026-06-10 01:37:02.632277', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:37:05.75105', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(352, TIMESTAMP '2026-06-10 01:39:44.844459', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:39:47.61194', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(353, TIMESTAMP '2026-06-10 01:40:18.628213', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:40:21.563028', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(354, TIMESTAMP '2026-06-10 01:42:05.795995', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:42:08.778217', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(355, TIMESTAMP '2026-06-10 01:44:47.656375', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:44:50.530725', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(356, TIMESTAMP '2026-06-10 01:45:21.617217', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:45:24.275332', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(357, TIMESTAMP '2026-06-10 01:47:08.84794', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:47:11.622804', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(358, TIMESTAMP '2026-06-10 01:49:50.626066', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:49:53.452252', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(359, TIMESTAMP '2026-06-10 01:50:24.324499', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:50:27.321706', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(360, TIMESTAMP '2026-06-10 01:52:11.690459', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:52:14.506616', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(361, TIMESTAMP '2026-06-10 01:54:53.497489', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:54:57.08616', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(362, TIMESTAMP '2026-06-10 01:55:27.373481', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:55:34.196647', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(363, TIMESTAMP '2026-06-10 01:57:14.560547', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:57:17.622655', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(364, TIMESTAMP '2026-06-10 01:59:57.142048', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 01:59:59.915479', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(365, TIMESTAMP '2026-06-10 02:00:34.243192', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:00:37.062031', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(366, TIMESTAMP '2026-06-10 02:02:17.665457', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:02:20.437553', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(367, TIMESTAMP '2026-06-10 02:04:59.980547', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:05:02.655677', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(368, TIMESTAMP '2026-06-10 02:05:37.142435', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:05:40.165906', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(369, TIMESTAMP '2026-06-10 02:07:20.497357', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:07:23.531669', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(370, TIMESTAMP '2026-06-10 02:10:02.719284', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:10:05.556966', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(371, TIMESTAMP '2026-06-10 02:10:40.234123', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:10:43.336478', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(372, TIMESTAMP '2026-06-10 02:12:23.608969', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:12:26.422118', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(373, TIMESTAMP '2026-06-10 02:15:05.613839', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:15:08.514096', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(374, TIMESTAMP '2026-06-10 02:15:43.397265', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:15:45.983001', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(375, TIMESTAMP '2026-06-10 02:17:26.473331', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:17:29.308221', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(376, TIMESTAMP '2026-06-10 02:20:08.573816', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:20:11.274017', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(377, TIMESTAMP '2026-06-10 02:20:46.050691', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:20:48.999976', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(378, TIMESTAMP '2026-06-10 02:22:29.363086', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:22:32.118123', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(379, TIMESTAMP '2026-06-10 02:25:11.337591', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:25:14.274904', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(380, TIMESTAMP '2026-06-10 02:25:49.049719', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:25:51.957423', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(381, TIMESTAMP '2026-06-10 02:27:32.169972', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:27:34.924758', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(382, TIMESTAMP '2026-06-10 02:30:14.345487', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:30:17.474287', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(383, TIMESTAMP '2026-06-10 02:30:52.019885', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:30:54.915572', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(384, TIMESTAMP '2026-06-10 02:32:34.987366', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:32:37.860743', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(385, TIMESTAMP '2026-06-10 02:35:17.527012', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:35:20.027159', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(386, TIMESTAMP '2026-06-10 02:35:54.972467', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:35:57.64408', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(387, TIMESTAMP '2026-06-10 02:37:37.939092', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:37:40.519033', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(388, TIMESTAMP '2026-06-10 02:40:20.089426', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:40:22.678355', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(389, TIMESTAMP '2026-06-10 02:40:57.698933', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:41:00.509103', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(390, TIMESTAMP '2026-06-10 02:42:40.584645', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:42:43.259504', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(391, TIMESTAMP '2026-06-10 02:45:22.747892', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:45:25.61379', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(392, TIMESTAMP '2026-06-10 02:46:00.586046', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:46:03.396381', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(393, TIMESTAMP '2026-06-10 02:47:43.311722', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:47:46.263463', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(394, TIMESTAMP '2026-06-10 02:50:25.669341', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:50:28.449582', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(395, TIMESTAMP '2026-06-10 02:51:03.480834', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:51:06.310364', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(396, TIMESTAMP '2026-06-10 02:52:46.328747', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:52:50.003608', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(397, TIMESTAMP '2026-06-10 02:55:28.515029', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:55:31.956639', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(398, TIMESTAMP '2026-06-10 02:56:06.465354', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:56:09.216316', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(399, TIMESTAMP '2026-06-10 02:57:50.144774', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 02:57:53.307539', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(400, TIMESTAMP '2026-06-10 03:00:32.053417', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:00:34.786085', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(401, TIMESTAMP '2026-06-10 03:01:09.294445', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:01:12.274945', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(402, TIMESTAMP '2026-06-10 03:02:53.398738', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:02:56.435286', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(403, TIMESTAMP '2026-06-10 03:05:34.854074', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:05:37.548313', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(404, TIMESTAMP '2026-06-10 03:06:12.347873', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:06:15.167907', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(405, TIMESTAMP '2026-06-10 03:07:56.499835', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:07:59.394467', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(406, TIMESTAMP '2026-06-10 03:10:37.648492', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:10:40.421361', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(407, TIMESTAMP '2026-06-10 03:11:15.23851', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:11:18.086169', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(408, TIMESTAMP '2026-06-10 03:12:59.462871', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:13:02.153308', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(409, TIMESTAMP '2026-06-10 03:15:40.488692', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:15:44.751198', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(410, TIMESTAMP '2026-06-10 03:16:18.171926', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:16:22.158192', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(411, TIMESTAMP '2026-06-10 03:18:02.26066', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:18:06.178363', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(412, TIMESTAMP '2026-06-10 03:20:45.111769', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:20:48.735417', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(413, TIMESTAMP '2026-06-10 03:21:22.277842', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:21:26.383806', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(414, TIMESTAMP '2026-06-10 03:23:06.328194', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:23:10.12129', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(415, TIMESTAMP '2026-06-10 03:25:48.905374', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:25:52.563851', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(416, TIMESTAMP '2026-06-10 03:26:26.535729', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:26:30.357942', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(417, TIMESTAMP '2026-06-10 03:28:10.259186', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:28:14.455378', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(418, TIMESTAMP '2026-06-10 03:30:52.754561', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:30:56.332959', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(419, TIMESTAMP '2026-06-10 03:31:30.542103', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:31:34.355385', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(420, TIMESTAMP '2026-06-10 03:33:14.602111', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:33:18.370016', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(421, TIMESTAMP '2026-06-10 03:35:56.495936', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:36:00.478252', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(422, TIMESTAMP '2026-06-10 03:36:34.512065', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:36:38.666475', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(423, TIMESTAMP '2026-06-10 03:38:18.575506', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:38:22.505735', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(424, TIMESTAMP '2026-06-10 03:41:00.758616', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:41:04.468736', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(425, TIMESTAMP '2026-06-10 03:41:38.849698', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:41:42.868028', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(426, TIMESTAMP '2026-06-10 03:43:22.708599', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:43:26.562713', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(427, TIMESTAMP '2026-06-10 03:46:04.724975', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:46:08.773439', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(428, TIMESTAMP '2026-06-10 03:46:43.030162', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:46:47.026964', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(429, TIMESTAMP '2026-06-10 03:48:26.699436', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:48:30.421879', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(430, TIMESTAMP '2026-06-10 03:51:08.980941', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:51:12.913742', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(431, TIMESTAMP '2026-06-10 03:51:47.185946', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:51:51.851953', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(432, TIMESTAMP '2026-06-10 03:53:30.597628', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:53:34.533682', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(433, TIMESTAMP '2026-06-10 03:56:13.114258', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:56:16.749732', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(434, TIMESTAMP '2026-06-10 03:56:51.988128', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:56:55.808962', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(435, TIMESTAMP '2026-06-10 03:58:34.737321', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 03:58:38.187131', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(436, TIMESTAMP '2026-06-10 04:01:16.932212', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:01:20.700263', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'shipper@test.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 3);
INSERT INTO O_83 VALUES(437, TIMESTAMP '2026-06-10 04:01:55.947821', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:01:59.716041', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'transporter@test.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 4);
INSERT INTO O_83 VALUES(438, TIMESTAMP '2026-06-10 04:03:38.299502', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:03:41.97645', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Assignment Accepted', 'notification', 39);
INSERT INTO O_83 VALUES(449, TIMESTAMP '2026-06-10 04:31:28.658568', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:31:32.73565', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(450, TIMESTAMP '2026-06-10 04:31:28.667153', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:31:32.726613', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(481, TIMESTAMP '2026-06-10 04:42:38.376481', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:42:41.410211', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(482, TIMESTAMP '2026-06-10 04:42:38.376481', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:42:41.410211', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(513, TIMESTAMP '2026-06-10 04:48:18.780384', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:48:23.14589', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(514, TIMESTAMP '2026-06-10 04:48:18.780384', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:48:23.115132', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(515, TIMESTAMP '2026-06-10 04:53:23.132158', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:53:25.753118', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(516, TIMESTAMP '2026-06-10 04:53:23.150821', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:53:25.753118', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(517, TIMESTAMP '2026-06-10 04:58:25.762147', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:58:28.806858', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(518, TIMESTAMP '2026-06-10 04:58:25.762147', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 04:58:28.806858', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(545, TIMESTAMP '2026-06-10 05:07:08.89878', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:07:08.89878', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 0, NULL, 'QUEUED', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(546, TIMESTAMP '2026-06-10 05:07:08.899778', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:07:08.899778', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 0, NULL, 'QUEUED', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(577, TIMESTAMP '2026-06-10 05:10:52.457652', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:10:52.457652', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 0, NULL, 'QUEUED', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(578, TIMESTAMP '2026-06-10 05:10:52.457652', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:10:52.457652', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 0, NULL, 'QUEUED', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(579, TIMESTAMP '2026-06-10 05:13:55.995309', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:14:01.142913', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(580, TIMESTAMP '2026-06-10 05:13:55.9983', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:14:01.124961', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(581, TIMESTAMP '2026-06-10 05:13:56.903574', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:14:01.13294', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(582, TIMESTAMP '2026-06-10 05:13:57.105964', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:13:57.62199', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 0, TIMESTAMP '2026-06-10 05:13:57.601047', 'SENT', 'TruckMitra Notification', 'notification', 39);
INSERT INTO O_83 VALUES(583, TIMESTAMP '2026-06-10 05:14:00.572627', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:14:00.572627', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 0, NULL, 'QUEUED', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(584, TIMESTAMP '2026-06-10 05:14:00.620063', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:14:00.620063', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 0, NULL, 'QUEUED', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(585, TIMESTAMP '2026-06-10 05:15:40.79155', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:15:44.840938', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(586, TIMESTAMP '2026-06-10 05:15:40.79155', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:15:44.861963', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(587, TIMESTAMP '2026-06-10 05:15:47.399668', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:15:49.935069', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(588, TIMESTAMP '2026-06-10 05:15:48.359138', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:15:48.574417', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 0, TIMESTAMP '2026-06-10 05:15:48.570843', 'SENT', 'TruckMitra Notification', 'notification', 39);
INSERT INTO O_83 VALUES(589, TIMESTAMP '2026-06-10 05:15:50.934665', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:15:55.092178', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(590, TIMESTAMP '2026-06-10 05:15:50.963143', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:15:55.092178', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(591, TIMESTAMP '2026-06-10 05:20:44.87009', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:20:47.456326', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(592, TIMESTAMP '2026-06-10 05:20:44.869094', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:20:47.456326', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(593, TIMESTAMP '2026-06-10 05:20:49.945712', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:20:52.320399', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(594, TIMESTAMP '2026-06-10 05:20:55.19037', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:20:57.724458', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(595, TIMESTAMP '2026-06-10 05:20:55.19037', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:20:57.724458', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(596, TIMESTAMP '2026-06-10 05:25:47.469176', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:25:49.992214', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(597, TIMESTAMP '2026-06-10 05:25:47.469176', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:25:49.991218', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(598, TIMESTAMP '2026-06-10 05:25:52.327786', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:25:54.882771', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(599, TIMESTAMP '2026-06-10 05:25:57.73524', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:26:00.694969', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(600, TIMESTAMP '2026-06-10 05:25:57.73524', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:26:00.694969', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(601, TIMESTAMP '2026-06-10 05:30:50.015923', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:30:52.701052', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(602, TIMESTAMP '2026-06-10 05:30:50.015923', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:30:52.701052', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(603, TIMESTAMP '2026-06-10 05:30:54.897704', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:30:57.457753', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(604, TIMESTAMP '2026-06-10 05:31:00.706531', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:31:03.576', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(605, TIMESTAMP '2026-06-10 05:31:00.706531', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:31:03.576', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(606, TIMESTAMP '2026-06-10 05:35:52.711148', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:35:56.238656', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(607, TIMESTAMP '2026-06-10 05:35:52.711148', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:35:56.6432', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(608, TIMESTAMP '2026-06-10 05:35:57.483451', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:36:00.177502', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(609, TIMESTAMP '2026-06-10 05:36:03.590982', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:36:06.735734', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(610, TIMESTAMP '2026-06-10 05:36:03.590982', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:36:06.735734', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(617, TIMESTAMP '2026-06-10 05:40:40.023844', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:40:46.168651', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(618, TIMESTAMP '2026-06-10 05:40:40.020852', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:40:46.153286', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(619, TIMESTAMP '2026-06-10 05:40:50.196895', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:40:52.793558', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(620, TIMESTAMP '2026-06-10 05:40:51.138946', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:40:51.346244', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 0, TIMESTAMP '2026-06-10 05:40:51.34425', 'SENT', 'TruckMitra Notification', 'notification', 39);
INSERT INTO O_83 VALUES(621, TIMESTAMP '2026-06-10 05:40:53.914561', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:40:56.712177', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(622, TIMESTAMP '2026-06-10 05:40:53.918806', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:40:56.677368', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(623, TIMESTAMP '2026-06-10 05:45:46.167475', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:45:48.77436', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(624, TIMESTAMP '2026-06-10 05:45:46.177845', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:45:48.836485', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(625, TIMESTAMP '2026-06-10 05:45:52.798179', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:45:55.11301', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(626, TIMESTAMP '2026-06-10 05:45:56.682566', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:45:59.221897', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(627, TIMESTAMP '2026-06-10 05:45:56.716818', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:45:59.221897', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(628, TIMESTAMP '2026-06-10 05:50:48.786571', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:50:51.453367', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(629, TIMESTAMP '2026-06-10 05:50:48.846393', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:50:51.479817', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(630, TIMESTAMP '2026-06-10 05:50:55.126275', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:50:57.655796', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(631, TIMESTAMP '2026-06-10 05:50:59.232934', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:51:01.783835', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(632, TIMESTAMP '2026-06-10 05:50:59.232934', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:51:01.81726', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(633, TIMESTAMP '2026-06-10 05:55:51.482179', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:55:54.517061', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(634, TIMESTAMP '2026-06-10 05:55:51.491328', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:55:54.893721', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(635, TIMESTAMP '2026-06-10 05:55:57.669114', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:56:00.362149', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(636, TIMESTAMP '2026-06-10 05:56:01.803294', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:56:04.403449', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(637, TIMESTAMP '2026-06-10 05:56:01.83078', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:56:04.403449', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(638, TIMESTAMP '2026-06-10 06:00:54.538107', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:00:56.985801', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(639, TIMESTAMP '2026-06-10 06:00:54.912735', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:00:57.487897', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(640, TIMESTAMP '2026-06-10 06:01:00.386506', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:01:02.857869', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(641, TIMESTAMP '2026-06-10 06:01:04.423833', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:01:06.927026', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(642, TIMESTAMP '2026-06-10 06:01:04.423833', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:01:06.798796', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(643, TIMESTAMP '2026-06-10 06:05:57.009662', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:05:59.619896', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(644, TIMESTAMP '2026-06-10 06:05:57.506137', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:06:00.113705', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(645, TIMESTAMP '2026-06-10 06:06:02.930904', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:06:05.67969', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(646, TIMESTAMP '2026-06-10 06:06:06.875338', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:06:09.758361', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(647, TIMESTAMP '2026-06-10 06:06:06.951615', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:06:09.762525', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(648, TIMESTAMP '2026-06-10 06:10:59.639644', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:11:02.036834', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(649, TIMESTAMP '2026-06-10 06:11:00.140341', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:11:02.639369', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(650, TIMESTAMP '2026-06-10 06:11:05.705369', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:11:08.051334', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(651, TIMESTAMP '2026-06-10 06:11:09.796736', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:11:12.476597', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(652, TIMESTAMP '2026-06-10 06:11:09.796736', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:11:12.476597', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(653, TIMESTAMP '2026-06-10 06:16:02.062852', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:16:04.711962', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(654, TIMESTAMP '2026-06-10 06:16:02.666989', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:16:05.257008', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(655, TIMESTAMP '2026-06-10 06:16:08.074598', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:16:10.512223', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(656, TIMESTAMP '2026-06-10 06:16:12.5176', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:16:15.369657', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(657, TIMESTAMP '2026-06-10 06:16:12.5176', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:16:15.312422', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(658, TIMESTAMP '2026-06-10 06:21:04.742012', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:21:07.357398', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(659, TIMESTAMP '2026-06-10 06:21:05.285537', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:21:07.943557', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(660, TIMESTAMP '2026-06-10 06:21:10.544233', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:21:12.979182', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(661, TIMESTAMP '2026-06-10 06:21:15.370565', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:21:17.9505', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(662, TIMESTAMP '2026-06-10 06:21:15.406598', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:21:17.999879', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(663, TIMESTAMP '2026-06-10 06:26:07.391976', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:26:10.010725', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(664, TIMESTAMP '2026-06-10 06:26:07.986933', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:26:10.545824', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(665, TIMESTAMP '2026-06-10 06:26:13.0099', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:26:15.488974', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(666, TIMESTAMP '2026-06-10 06:26:18.001401', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:26:20.609508', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(667, TIMESTAMP '2026-06-10 06:26:18.054535', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:26:20.480778', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(668, TIMESTAMP '2026-06-10 06:31:10.091242', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:31:13.743243', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(669, TIMESTAMP '2026-06-10 06:31:10.581756', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:31:13.332672', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(670, TIMESTAMP '2026-06-10 06:31:15.526511', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:31:18.132996', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(671, TIMESTAMP '2026-06-10 06:31:20.578139', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:31:23.100788', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(672, TIMESTAMP '2026-06-10 06:31:20.652818', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:31:23.292088', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(673, TIMESTAMP '2026-06-10 06:36:13.383805', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:36:15.835198', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(674, TIMESTAMP '2026-06-10 06:36:13.837096', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:36:16.365643', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(675, TIMESTAMP '2026-06-10 06:36:18.172748', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:36:20.788509', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(676, TIMESTAMP '2026-06-10 06:36:23.175724', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:36:25.616268', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(677, TIMESTAMP '2026-06-10 06:36:23.295145', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:36:25.872447', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(678, TIMESTAMP '2026-06-10 06:41:15.903282', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:41:18.846789', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(679, TIMESTAMP '2026-06-10 06:41:16.414228', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:41:19.114172', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(680, TIMESTAMP '2026-06-10 06:41:20.831017', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:41:23.558081', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(681, TIMESTAMP '2026-06-10 06:41:25.682934', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:41:28.461267', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(682, TIMESTAMP '2026-06-10 06:41:25.913882', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:41:28.571865', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(683, TIMESTAMP '2026-06-10 06:46:18.904728', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:46:22.337706', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(684, TIMESTAMP '2026-06-10 06:46:19.168356', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:46:22.337706', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(685, TIMESTAMP '2026-06-10 06:46:23.607443', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:46:26.182029', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(686, TIMESTAMP '2026-06-10 06:46:28.627892', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:46:31.395999', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(687, TIMESTAMP '2026-06-10 06:46:28.678071', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:46:31.16558', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(688, TIMESTAMP '2026-06-10 06:51:22.491236', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:51:26.487979', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 8);
INSERT INTO O_83 VALUES(689, TIMESTAMP '2026-06-10 06:51:22.491236', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:51:26.593215', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Trip Started', 'notification', 39);
INSERT INTO O_83 VALUES(690, TIMESTAMP '2026-06-10 06:51:26.244845', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:51:29.149333', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 1, NULL, 'RETRYING', 'Delivery Submitted - Action Required', 'notification', 39);
INSERT INTO O_83 VALUES(691, TIMESTAMP '2026-06-10 06:51:31.296065', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:51:34.385208', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(692, TIMESTAMP '2026-06-10 06:51:31.399732', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 06:51:34.385208', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(713, TIMESTAMP '2026-06-10 07:39:31.256931', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:31.376809', NULL, 'PUSH', 'Template: NOTIFICATION', NULL, NULL, 'poonam@gmail.com', 0, TIMESTAMP '2026-06-10 07:39:31.368644', 'SENT', 'TruckMitra Notification', 'notification', 39);
INSERT INTO O_83 VALUES(714, TIMESTAMP '2026-06-10 07:39:33.921637', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:37.331353', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(715, TIMESTAMP '2026-06-10 07:39:33.921637', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:37.331353', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(716, TIMESTAMP '2026-06-10 07:44:37.345841', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:44:39.907058', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(717, TIMESTAMP '2026-06-10 07:44:37.342848', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:44:39.861963', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(718, TIMESTAMP '2026-06-10 07:49:39.894409', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:49:42.616035', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(719, TIMESTAMP '2026-06-10 07:49:39.911215', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:49:42.616035', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(720, TIMESTAMP '2026-06-10 07:54:42.627849', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:54:45.552756', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(721, TIMESTAMP '2026-06-10 07:54:42.627849', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:54:45.553765', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(722, TIMESTAMP '2026-06-10 07:59:45.577871', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:59:48.409776', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(723, TIMESTAMP '2026-06-10 07:59:45.576908', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:59:48.409776', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(724, TIMESTAMP '2026-06-10 22:17:36.425649', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:17:36.875457', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(725, TIMESTAMP '2026-06-10 22:17:36.424649', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:17:36.875457', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(726, TIMESTAMP '2026-06-10 22:22:36.913639', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:22:48.247838', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(727, TIMESTAMP '2026-06-10 22:22:36.940564', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:22:48.247838', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(728, TIMESTAMP '2026-06-10 22:27:48.281975', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:27:50.854316', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(729, TIMESTAMP '2026-06-10 22:27:48.301353', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:27:50.854316', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(730, TIMESTAMP '2026-06-10 22:32:50.88286', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:32:53.893753', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(731, TIMESTAMP '2026-06-10 22:32:50.885994', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:32:53.930649', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(732, TIMESTAMP '2026-06-10 22:37:53.961447', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:37:58.390651', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(733, TIMESTAMP '2026-06-10 22:37:53.961447', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:37:58.417582', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(734, TIMESTAMP '2026-06-10 22:42:58.44228', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:43:01.137662', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(735, TIMESTAMP '2026-06-10 22:42:58.44228', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:43:01.096708', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(736, TIMESTAMP '2026-06-10 22:48:01.170219', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:48:03.956246', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(737, TIMESTAMP '2026-06-10 22:48:01.171215', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:48:03.956246', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(738, TIMESTAMP '2026-06-10 22:53:03.980987', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:53:07.093777', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(739, TIMESTAMP '2026-06-10 22:53:03.978905', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:53:07.063853', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(740, TIMESTAMP '2026-06-10 22:58:07.146217', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:58:10.31752', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(741, TIMESTAMP '2026-06-10 22:58:07.146217', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 22:58:10.344201', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(742, TIMESTAMP '2026-06-10 23:03:10.372804', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:03:13.464111', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(743, TIMESTAMP '2026-06-10 23:03:10.375065', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:03:13.425207', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(744, TIMESTAMP '2026-06-10 23:08:13.502613', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:08:16.595799', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(745, TIMESTAMP '2026-06-10 23:08:13.502613', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:08:16.560905', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(746, TIMESTAMP '2026-06-10 23:13:16.619193', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:13:19.524285', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(747, TIMESTAMP '2026-06-10 23:13:16.621607', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:13:19.629302', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(748, TIMESTAMP '2026-06-10 23:18:19.593042', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:18:22.615073', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(749, TIMESTAMP '2026-06-10 23:18:19.634425', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:18:22.665653', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(750, TIMESTAMP '2026-06-10 23:23:22.700919', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:23:25.680075', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(751, TIMESTAMP '2026-06-10 23:23:22.700919', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:23:25.680075', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(752, TIMESTAMP '2026-06-10 23:28:25.74144', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:28:28.721769', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(753, TIMESTAMP '2026-06-10 23:28:25.74144', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:28:28.721769', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(754, TIMESTAMP '2026-06-10 23:33:28.768176', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:33:31.938292', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(755, TIMESTAMP '2026-06-10 23:33:28.767177', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:33:31.938292', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(756, TIMESTAMP '2026-06-10 23:38:31.967778', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:38:35.260744', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(757, TIMESTAMP '2026-06-10 23:38:31.967778', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:38:35.260744', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(758, TIMESTAMP '2026-06-10 23:43:35.301311', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:43:38.411981', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(759, TIMESTAMP '2026-06-10 23:43:35.306298', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:43:38.430928', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(760, TIMESTAMP '2026-06-10 23:48:38.478225', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:48:41.644719', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(761, TIMESTAMP '2026-06-10 23:48:38.478225', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:48:42.013743', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(762, TIMESTAMP '2026-06-10 23:53:41.665877', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:53:44.581267', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(763, TIMESTAMP '2026-06-10 23:53:42.045059', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:53:44.952576', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(764, TIMESTAMP '2026-06-10 23:58:44.610037', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:58:47.457781', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(765, TIMESTAMP '2026-06-10 23:58:44.983037', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 23:58:47.763447', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(766, TIMESTAMP '2026-06-11 00:03:47.483029', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:03:50.616436', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(767, TIMESTAMP '2026-06-11 00:03:47.802219', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:03:50.788647', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(768, TIMESTAMP '2026-06-11 00:08:50.677167', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:08:53.804392', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(769, TIMESTAMP '2026-06-11 00:08:50.822272', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:08:53.778461', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(770, TIMESTAMP '2026-06-11 00:13:53.8388', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:14:00.461356', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(771, TIMESTAMP '2026-06-11 00:13:53.842532', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:14:00.401465', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(772, TIMESTAMP '2026-06-11 00:19:00.502124', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:19:03.24755', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(773, TIMESTAMP '2026-06-11 00:19:00.50113', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:19:03.24755', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(774, TIMESTAMP '2026-06-11 00:24:03.281285', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:24:06.118489', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(775, TIMESTAMP '2026-06-11 00:24:03.281285', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:24:06.027923', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(776, TIMESTAMP '2026-06-11 00:29:06.118559', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:29:08.816331', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(777, TIMESTAMP '2026-06-11 00:29:06.151966', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:29:08.816331', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(778, TIMESTAMP '2026-06-11 00:34:08.860202', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:34:11.73055', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(779, TIMESTAMP '2026-06-11 00:34:08.860202', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:34:11.73055', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(780, TIMESTAMP '2026-06-11 00:39:11.76853', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:39:14.558107', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(781, TIMESTAMP '2026-06-11 00:39:11.76853', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:39:14.558107', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(782, TIMESTAMP '2026-06-11 00:44:14.601718', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:44:17.70988', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(783, TIMESTAMP '2026-06-11 00:44:14.601718', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 00:44:17.619595', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(784, TIMESTAMP '2026-06-11 02:10:07.540165', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:10:11.446709', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(785, TIMESTAMP '2026-06-11 02:10:07.614786', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:10:11.446709', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(786, TIMESTAMP '2026-06-11 02:15:11.513338', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:15:14.360431', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(787, TIMESTAMP '2026-06-11 02:15:11.513338', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:15:14.314893', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(788, TIMESTAMP '2026-06-11 02:20:14.362899', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:20:17.189242', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(789, TIMESTAMP '2026-06-11 02:20:14.398997', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:20:17.296817', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(790, TIMESTAMP '2026-06-11 02:25:17.26805', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:25:20.442967', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(791, TIMESTAMP '2026-06-11 02:25:17.345958', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:25:20.442967', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(792, TIMESTAMP '2026-06-11 02:30:20.495381', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:30:23.167554', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(793, TIMESTAMP '2026-06-11 02:30:20.502356', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:30:23.120671', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(794, TIMESTAMP '2026-06-11 02:35:23.213561', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:35:26.435271', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(795, TIMESTAMP '2026-06-11 02:35:23.249829', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:35:26.51323', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(796, TIMESTAMP '2026-06-11 02:40:26.514021', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:40:29.842527', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(797, TIMESTAMP '2026-06-11 02:40:26.570651', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:40:29.432987', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(798, TIMESTAMP '2026-06-11 02:45:29.481411', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:45:33.04327', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(799, TIMESTAMP '2026-06-11 02:45:29.908095', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:45:33.210212', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(800, TIMESTAMP '2026-06-11 02:50:33.095051', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:50:37.067063', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(801, TIMESTAMP '2026-06-11 02:50:33.252269', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:50:37.067063', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(802, TIMESTAMP '2026-06-11 02:55:37.114109', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:55:40.3286', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(803, TIMESTAMP '2026-06-11 02:55:37.114109', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 02:55:40.022287', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(804, TIMESTAMP '2026-06-11 03:00:40.071636', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:00:42.835558', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(805, TIMESTAMP '2026-06-11 03:00:40.363163', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:00:43.197498', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(806, TIMESTAMP '2026-06-11 03:05:42.878536', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:05:45.620763', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(807, TIMESTAMP '2026-06-11 03:05:43.229784', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:05:45.859483', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(808, TIMESTAMP '2026-06-11 03:10:45.681447', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:10:45.878743', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(809, TIMESTAMP '2026-06-11 03:10:45.89859', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:10:46.112116', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(810, TIMESTAMP '2026-06-11 03:15:45.927989', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:15:46.118038', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(811, TIMESTAMP '2026-06-11 03:15:46.148468', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:15:46.361835', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(812, TIMESTAMP '2026-06-11 03:20:46.168973', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:20:46.404159', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(813, TIMESTAMP '2026-06-11 03:20:46.392572', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:20:46.62931', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(814, TIMESTAMP '2026-06-11 03:25:46.481459', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:25:46.696757', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(815, TIMESTAMP '2026-06-11 03:25:46.666836', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:25:46.941969', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(816, TIMESTAMP '2026-06-11 03:30:46.771361', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:30:46.97713', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(817, TIMESTAMP '2026-06-11 03:30:46.990591', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:30:47.213673', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(818, TIMESTAMP '2026-06-11 03:35:47.019837', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:35:47.211305', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(819, TIMESTAMP '2026-06-11 03:35:47.250708', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:35:47.442228', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(820, TIMESTAMP '2026-06-11 03:40:47.246295', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:40:47.448814', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(821, TIMESTAMP '2026-06-11 03:40:47.483719', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:40:47.679741', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(822, TIMESTAMP '2026-06-11 03:45:47.484215', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:45:47.743372', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(823, TIMESTAMP '2026-06-11 03:45:47.718435', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:45:48.005762', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(824, TIMESTAMP '2026-06-11 03:50:47.826777', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:50:48.032879', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(825, TIMESTAMP '2026-06-11 03:50:48.048836', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:50:48.285734', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(826, TIMESTAMP '2026-06-11 03:55:48.07457', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:55:48.343098', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(827, TIMESTAMP '2026-06-11 03:55:48.319903', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 03:55:48.656249', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(828, TIMESTAMP '2026-06-11 04:00:48.4421', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:00:48.671129', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(829, TIMESTAMP '2026-06-11 04:00:48.702558', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:00:48.92205', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(830, TIMESTAMP '2026-06-11 04:05:48.709859', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:05:48.960651', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(831, TIMESTAMP '2026-06-11 04:05:48.963641', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:05:49.210399', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(832, TIMESTAMP '2026-06-11 04:10:49.002819', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:10:49.228014', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(833, TIMESTAMP '2026-06-11 04:10:49.249956', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:10:49.482048', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(834, TIMESTAMP '2026-06-11 04:15:49.280352', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:15:49.518331', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(835, TIMESTAMP '2026-06-11 04:15:49.527316', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:15:49.790296', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(836, TIMESTAMP '2026-06-11 04:20:49.575451', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:20:49.80051', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(837, TIMESTAMP '2026-06-11 04:20:49.832622', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 04:20:50.063202', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(838, TIMESTAMP '2026-06-11 05:21:26.736434', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:21:30.061211', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(839, TIMESTAMP '2026-06-11 05:21:26.999283', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:21:30.061211', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(840, TIMESTAMP '2026-06-11 05:26:30.109935', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:26:33.620107', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(841, TIMESTAMP '2026-06-11 05:26:30.115478', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:26:33.620107', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(842, TIMESTAMP '2026-06-11 05:31:33.681838', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:31:36.555943', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(843, TIMESTAMP '2026-06-11 05:31:33.681838', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:31:36.600819', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(844, TIMESTAMP '2026-06-11 05:36:36.667477', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:36:39.373452', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(845, TIMESTAMP '2026-06-11 05:36:36.671464', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:36:39.373452', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(846, TIMESTAMP '2026-06-11 05:41:39.486357', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:41:42.22695', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(847, TIMESTAMP '2026-06-11 05:41:39.486357', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:41:42.13211', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(848, TIMESTAMP '2026-06-11 05:46:42.181723', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:46:44.795871', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(849, TIMESTAMP '2026-06-11 05:46:42.276699', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:46:44.892543', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(850, TIMESTAMP '2026-06-11 05:51:44.890881', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:51:47.650006', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(851, TIMESTAMP '2026-06-11 05:51:44.955868', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:51:47.700946', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(852, TIMESTAMP '2026-06-11 05:56:47.747931', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:56:52.905988', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(853, TIMESTAMP '2026-06-11 05:56:47.746932', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 05:56:52.905988', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(854, TIMESTAMP '2026-06-11 06:01:52.95821', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:01:55.696057', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(855, TIMESTAMP '2026-06-11 06:01:52.95821', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:01:55.641203', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(856, TIMESTAMP '2026-06-11 06:06:55.69735', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:06:58.322232', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(857, TIMESTAMP '2026-06-11 06:06:55.741396', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:06:58.322232', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(858, TIMESTAMP '2026-06-11 06:11:58.369434', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:12:03.05837', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(859, TIMESTAMP '2026-06-11 06:11:58.370428', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:12:02.593823', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(860, TIMESTAMP '2026-06-11 06:17:02.663046', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:17:05.139547', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(861, TIMESTAMP '2026-06-11 06:17:03.112288', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:17:05.540183', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(862, TIMESTAMP '2026-06-11 06:22:05.204531', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:22:08.108151', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(863, TIMESTAMP '2026-06-11 06:22:05.590232', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:22:08.199929', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(864, TIMESTAMP '2026-06-11 06:27:08.202119', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:27:10.953923', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(865, TIMESTAMP '2026-06-11 06:27:08.248578', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:27:11.062552', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(866, TIMESTAMP '2026-06-11 06:32:11.064005', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:32:11.601726', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(867, TIMESTAMP '2026-06-11 06:32:11.113056', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:32:11.758098', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(868, TIMESTAMP '2026-06-11 06:37:11.70398', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:37:12.126249', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(869, TIMESTAMP '2026-06-11 06:37:11.808452', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:37:12.394895', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(870, TIMESTAMP '2026-06-11 06:42:12.28156', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:42:12.84521', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(871, TIMESTAMP '2026-06-11 06:42:12.437043', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:42:13.007206', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(872, TIMESTAMP '2026-06-11 06:47:12.959104', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:47:13.658869', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(873, TIMESTAMP '2026-06-11 06:47:13.066305', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:47:13.776019', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(874, TIMESTAMP '2026-06-11 06:52:13.776851', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:52:14.654212', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(875, TIMESTAMP '2026-06-11 06:52:13.831836', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:52:14.603769', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(876, TIMESTAMP '2026-06-11 06:57:14.655143', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:57:15.411913', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(877, TIMESTAMP '2026-06-11 06:57:14.719769', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 06:57:15.606206', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(878, TIMESTAMP '2026-06-11 07:02:15.487385', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 07:02:16.164296', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(879, TIMESTAMP '2026-06-11 07:02:15.683664', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 07:02:16.363498', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(880, TIMESTAMP '2026-06-11 09:02:06.653197', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:02:10.249025', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(881, TIMESTAMP '2026-06-11 09:02:06.825669', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:02:10.137776', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(882, TIMESTAMP '2026-06-11 09:07:10.327315', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:07:14.182261', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(883, TIMESTAMP '2026-06-11 09:07:10.327315', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:07:13.798535', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(884, TIMESTAMP '2026-06-11 09:12:13.870771', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:12:16.942236', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(885, TIMESTAMP '2026-06-11 09:12:14.250838', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:12:17.072996', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(886, TIMESTAMP '2026-06-11 09:17:17.13704', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:17:20.211291', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(887, TIMESTAMP '2026-06-11 09:17:17.137939', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:17:20.273707', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(888, TIMESTAMP '2026-06-11 09:22:20.273989', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:22:23.650373', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(889, TIMESTAMP '2026-06-11 09:22:20.341873', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:22:23.706281', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(890, TIMESTAMP '2026-06-11 09:27:23.76473', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:27:27.311049', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(891, TIMESTAMP '2026-06-11 09:27:23.76473', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:27:27.311049', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(892, TIMESTAMP '2026-06-11 09:32:27.368228', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:32:30.406488', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(893, TIMESTAMP '2026-06-11 09:32:27.368228', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:32:30.235205', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(894, TIMESTAMP '2026-06-11 09:47:29.019691', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:47:33.772366', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(895, TIMESTAMP '2026-06-11 09:47:29.142087', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:47:33.772366', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(896, TIMESTAMP '2026-06-11 09:52:33.971304', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:52:38.576493', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(897, TIMESTAMP '2026-06-11 09:52:33.96997', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:52:38.306618', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(898, TIMESTAMP '2026-06-11 09:57:38.478535', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:57:42.8606', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(899, TIMESTAMP '2026-06-11 09:57:38.715357', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 09:57:43.224759', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(900, TIMESTAMP '2026-06-11 10:02:43.104917', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:02:48.078994', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(901, TIMESTAMP '2026-06-11 10:02:43.353607', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:02:48.241458', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(902, TIMESTAMP '2026-06-11 10:07:48.42568', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:07:53.022382', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(903, TIMESTAMP '2026-06-11 10:07:48.536683', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:07:53.169719', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(904, TIMESTAMP '2026-06-11 10:12:53.3515', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:12:57.991815', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(905, TIMESTAMP '2026-06-11 10:12:53.467213', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:12:57.81114', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(906, TIMESTAMP '2026-06-11 10:17:58.116122', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:18:03.341691', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(907, TIMESTAMP '2026-06-11 10:17:58.116122', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:18:03.13871', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(908, TIMESTAMP '2026-06-11 10:23:03.466019', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:23:07.820112', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(909, TIMESTAMP '2026-06-11 10:23:03.474812', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:23:07.94564', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(910, TIMESTAMP '2026-06-11 10:28:08.086192', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:28:12.730586', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(911, TIMESTAMP '2026-06-11 10:28:08.086192', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:28:12.730586', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(912, TIMESTAMP '2026-06-11 10:33:12.883311', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:33:20.621645', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(913, TIMESTAMP '2026-06-11 10:33:12.883311', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 10:33:20.751153', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(914, TIMESTAMP '2026-06-11 21:57:46.647623', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 21:57:52.332243', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(915, TIMESTAMP '2026-06-11 21:57:46.849839', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 21:57:52.332243', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(916, TIMESTAMP '2026-06-11 22:02:52.46592', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:02:57.452201', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(917, TIMESTAMP '2026-06-11 22:02:52.466917', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:02:57.254', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(918, TIMESTAMP '2026-06-11 22:07:57.595638', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:08:02.220311', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(919, TIMESTAMP '2026-06-11 22:07:57.77194', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:08:02.050998', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(920, TIMESTAMP '2026-06-11 22:13:02.348474', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:13:06.787456', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(921, TIMESTAMP '2026-06-11 22:13:02.347437', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:13:06.787456', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(922, TIMESTAMP '2026-06-11 22:18:06.941475', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:18:11.664539', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(923, TIMESTAMP '2026-06-11 22:18:06.941475', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:18:11.801149', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(924, TIMESTAMP '2026-06-11 22:23:12.008061', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:23:16.721143', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(925, TIMESTAMP '2026-06-11 22:23:12.139785', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:23:16.931835', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(926, TIMESTAMP '2026-06-11 22:28:17.060957', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:28:21.666684', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(927, TIMESTAMP '2026-06-11 22:28:17.25542', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:28:21.850354', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(928, TIMESTAMP '2026-06-11 22:33:21.973448', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:33:26.847134', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(929, TIMESTAMP '2026-06-11 22:33:21.973448', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:33:26.682506', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(930, TIMESTAMP '2026-06-11 22:38:26.982959', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:38:32.457545', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(931, TIMESTAMP '2026-06-11 22:38:27.155197', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:38:32.263491', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(932, TIMESTAMP '2026-06-11 22:43:32.459793', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:43:36.705443', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(933, TIMESTAMP '2026-06-11 22:43:32.596105', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:43:37.012964', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(934, TIMESTAMP '2026-06-11 22:48:37.015744', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:48:41.465513', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(935, TIMESTAMP '2026-06-11 22:48:37.16542', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:48:41.634643', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(936, TIMESTAMP '2026-06-11 22:53:41.808871', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:53:46.710548', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(937, TIMESTAMP '2026-06-11 22:53:42.015725', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:53:46.905134', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(938, TIMESTAMP '2026-06-11 22:58:47.039478', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:58:51.971344', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(939, TIMESTAMP '2026-06-11 22:58:47.039478', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 22:58:51.632135', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(940, TIMESTAMP '2026-06-11 23:03:51.973105', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:03:57.014011', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(941, TIMESTAMP '2026-06-11 23:03:52.108089', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:03:57.014011', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(942, TIMESTAMP '2026-06-11 23:08:57.151249', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:09:02.158308', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(943, TIMESTAMP '2026-06-11 23:08:57.151249', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:09:02.021363', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(944, TIMESTAMP '2026-06-11 23:14:02.353107', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:14:07.186626', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(945, TIMESTAMP '2026-06-11 23:14:02.489342', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:14:06.996877', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(946, TIMESTAMP '2026-06-11 23:19:07.330664', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:19:11.733586', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(947, TIMESTAMP '2026-06-11 23:19:07.330664', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:19:12.303872', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(948, TIMESTAMP '2026-06-11 23:24:12.098668', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:24:16.346002', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(949, TIMESTAMP '2026-06-11 23:24:12.463727', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:24:16.694386', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(950, TIMESTAMP '2026-06-11 23:29:16.555168', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:29:20.894462', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(951, TIMESTAMP '2026-06-11 23:29:16.907683', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:29:21.434458', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(952, TIMESTAMP '2026-06-11 23:34:21.094244', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:34:25.522079', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(953, TIMESTAMP '2026-06-11 23:34:21.593532', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:34:26.034586', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(954, TIMESTAMP '2026-06-11 23:39:25.699095', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:39:30.324887', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(955, TIMESTAMP '2026-06-11 23:39:26.263508', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:39:30.476354', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(956, TIMESTAMP '2026-06-11 23:44:30.673179', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:44:35.98598', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(957, TIMESTAMP '2026-06-11 23:44:30.833441', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:44:35.598964', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(958, TIMESTAMP '2026-06-11 23:49:35.98799', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:49:41.88487', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(959, TIMESTAMP '2026-06-11 23:49:36.133544', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:49:41.88487', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(960, TIMESTAMP '2026-06-11 23:54:42.056975', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:54:47.380904', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(961, TIMESTAMP '2026-06-11 23:54:42.056975', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:54:47.225939', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(962, TIMESTAMP '2026-06-11 23:59:47.587034', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:59:52.397766', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(963, TIMESTAMP '2026-06-11 23:59:47.587034', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-11 23:59:52.606555', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(964, TIMESTAMP '2026-06-12 00:11:51.215549', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:11:56.70504', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(965, TIMESTAMP '2026-06-12 00:11:51.219095', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:11:56.153447', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(966, TIMESTAMP '2026-06-12 00:16:56.557828', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:17:00.945281', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(967, TIMESTAMP '2026-06-12 00:16:56.919905', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:17:01.555956', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(968, TIMESTAMP '2026-06-12 00:22:01.344101', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:22:06.360536', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(969, TIMESTAMP '2026-06-12 00:22:01.717119', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:22:06.152876', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(970, TIMESTAMP '2026-06-12 00:27:06.392801', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:27:11.340674', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(971, TIMESTAMP '2026-06-12 00:27:06.525917', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:27:11.340674', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(972, TIMESTAMP '2026-06-12 00:32:11.720746', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:32:16.52396', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(973, TIMESTAMP '2026-06-12 00:32:11.720746', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:32:16.769045', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(974, TIMESTAMP '2026-06-12 00:37:16.913508', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:37:21.207506', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(975, TIMESTAMP '2026-06-12 00:37:17.095908', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:37:21.821918', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(976, TIMESTAMP '2026-06-12 00:42:21.555961', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:42:26.552302', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(977, TIMESTAMP '2026-06-12 00:42:21.973304', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:42:26.750534', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(978, TIMESTAMP '2026-06-12 00:51:13.054985', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:51:17.41894', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(979, TIMESTAMP '2026-06-12 00:51:13.273935', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:51:18.079503', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(980, TIMESTAMP '2026-06-12 00:56:17.835489', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:56:22.680189', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(981, TIMESTAMP '2026-06-12 00:56:18.26529', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 00:56:23.271121', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(982, TIMESTAMP '2026-06-12 01:01:23.106682', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:01:27.626896', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(983, TIMESTAMP '2026-06-12 01:01:23.510432', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:01:28.291707', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(984, TIMESTAMP '2026-06-12 01:06:28.035012', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:06:31.125287', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(985, TIMESTAMP '2026-06-12 01:06:28.451523', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:06:31.871976', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(986, TIMESTAMP '2026-06-12 01:11:31.436909', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:11:35.548867', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(987, TIMESTAMP '2026-06-12 01:11:32.009344', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:11:36.328696', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(988, TIMESTAMP '2026-06-12 01:16:35.652774', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:16:38.954739', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(989, TIMESTAMP '2026-06-12 01:16:36.449267', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:16:39.779648', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(990, TIMESTAMP '2026-06-12 01:21:39.096393', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:21:44.59884', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(991, TIMESTAMP '2026-06-12 01:21:39.889596', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:21:44.826803', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(992, TIMESTAMP '2026-06-12 01:26:44.691269', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:26:50.419069', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(993, TIMESTAMP '2026-06-12 01:26:44.922905', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:26:50.419069', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(994, TIMESTAMP '2026-06-12 01:31:50.557556', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:31:54.175985', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(995, TIMESTAMP '2026-06-12 01:31:50.560549', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:31:53.969695', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(996, TIMESTAMP '2026-06-12 01:36:54.177549', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:36:57.844273', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(997, TIMESTAMP '2026-06-12 01:36:54.263031', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:36:57.844273', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(998, TIMESTAMP '2026-06-12 01:41:57.964745', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:42:01.622812', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(999, TIMESTAMP '2026-06-12 01:41:57.964745', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:42:01.489159', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(1000, TIMESTAMP '2026-06-12 01:47:01.707222', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:47:07.342248', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(1001, TIMESTAMP '2026-06-12 01:47:01.825144', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:47:07.342248', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(1002, TIMESTAMP '2026-06-12 01:52:07.487688', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:52:11.044602', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(1003, TIMESTAMP '2026-06-12 01:52:07.487688', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:52:11.352068', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(1004, TIMESTAMP '2026-06-12 01:57:11.144952', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:57:14.969462', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(1005, TIMESTAMP '2026-06-12 01:57:11.35521', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 01:57:15.265292', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(1006, TIMESTAMP '2026-06-12 02:02:15.163678', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:02:18.605928', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(1007, TIMESTAMP '2026-06-12 02:02:15.354461', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:02:18.930087', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(1008, TIMESTAMP '2026-06-12 02:07:18.812765', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:07:23.039798', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(1009, TIMESTAMP '2026-06-12 02:07:19.029029', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:07:22.955393', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(1010, TIMESTAMP '2026-06-12 02:12:23.156497', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:12:28.415637', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(1011, TIMESTAMP '2026-06-12 02:12:23.156497', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:12:28.415637', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(1012, TIMESTAMP '2026-06-12 02:17:28.548578', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:17:32.873906', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(1013, TIMESTAMP '2026-06-12 02:17:28.548578', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:17:33.188546', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
INSERT INTO O_83 VALUES(1014, TIMESTAMP '2026-06-12 02:22:32.967175', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:22:36.826839', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'snehal@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 7);
INSERT INTO O_83 VALUES(1015, TIMESTAMP '2026-06-12 02:22:33.31622', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-12 02:22:37.657521', NULL, 'EMAIL', 'Template: NOTIFICATION', NULL, NULL, 'ankita@gmail.com', 1, NULL, 'RETRYING', 'Trip Completed', 'notification', 8);
CREATE TABLE O_107(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR, C23 VARCHAR, C24 VARCHAR, C25 VARCHAR, C26 VARCHAR, C27 VARCHAR, C28 VARCHAR, C29 VARCHAR, C30 VARCHAR, C31 VARCHAR, C32 VARCHAR, C33 VARCHAR, C34 VARCHAR, C35 VARCHAR, C36 VARCHAR, C37 VARCHAR, C38 VARCHAR, C39 VARCHAR, C40 VARCHAR, C41 VARCHAR, C42 VARCHAR, C43 VARCHAR);
INSERT INTO O_107 VALUES(2, TIMESTAMP '2026-06-10 05:15:48.316626', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:15:48.316626', NULL, 567700.00, NULL, NULL, NULL, NULL, 567700.00, 'Trip Completion: TRP-20260609-EBED681A', 'CREDIT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, TIMESTAMP '2026-06-10 05:15:48.294911', 'TXN-20260610-0515-0ADAFC45', 'TRIP_PAYMENT', NULL, NULL, NULL, 39, 'TRANSPORTER', 35);
INSERT INTO O_107 VALUES(34, TIMESTAMP '2026-06-10 05:40:51.088224', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 05:40:51.088224', NULL, 567700.00, NULL, NULL, NULL, NULL, 1135400.00, 'Trip Completion: TRP-20260609-EBED681A', 'CREDIT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, TIMESTAMP '2026-06-10 05:40:51.067342', 'TXN-20260610-0540-F1CB5B9C', 'TRIP_PAYMENT', NULL, NULL, NULL, 39, 'TRANSPORTER', 35);
INSERT INTO O_107 VALUES(66, TIMESTAMP '2026-06-10 07:39:31.185856', NULL, NULL, TRUE, FALSE, TIMESTAMP '2026-06-10 07:39:31.185856', NULL, 567700.00, NULL, NULL, NULL, NULL, 1703100.00, 'Trip Completion: TRP-20260609-EBED681A', 'CREDIT', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'SUCCESS', NULL, NULL, TIMESTAMP '2026-06-10 07:39:31.173462', 'TXN-20260610-0739-F847B5BC', 'TRIP_PAYMENT', NULL, NULL, NULL, 39, 'TRANSPORTER', 35);
CREATE TABLE O_87(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR);
INSERT INTO O_87 VALUES(1, TIMESTAMP '2026-06-09 03:23:28.686401', U&'Your bid of \20b9567900.00 for load ''Construction'' was not selected. Keep bidding!', FALSE, 'Bid Not Selected', 'BID', 39);
INSERT INTO O_87 VALUES(2, TIMESTAMP '2026-06-09 03:23:29.102968', U&'Congratulations! Your bid of \20b9567700.00 for ''Construction'' (pune  \2192 nashik) has been accepted. Please assign a driver.', FALSE, U&'\+01f389 Bid Accepted!', 'BID', 39);
INSERT INTO O_87 VALUES(3, TIMESTAMP '2026-06-09 03:23:29.342621', 'You accepted a bid from poonam  for your load ''Construction''. Trip will begin shortly.', FALSE, 'Transporter Assigned', 'TRIP', 8);
INSERT INTO O_87 VALUES(33, TIMESTAMP '2026-06-09 11:03:22.088748', U&'Test Transporter placed a bid of \20b918000.0 on your load: Steel (Mumbai \2192 Pune)', FALSE, 'New Bid Received', 'BID', 3);
INSERT INTO O_87 VALUES(34, TIMESTAMP '2026-06-09 11:03:48.789547', U&'Test Transporter placed a bid of \20b918000.0 on your load: Steel (Mumbai \2192 Pune)', FALSE, 'New Bid Received', 'BID', 3);
INSERT INTO O_87 VALUES(35, TIMESTAMP '2026-06-09 11:03:48.854548', U&'Congratulations! Your bid of \20b918000.00 for ''Steel'' (Mumbai \2192 Pune) has been accepted. Please assign a driver.', FALSE, U&'\+01f389 Bid Accepted!', 'BID', 4);
INSERT INTO O_87 VALUES(36, TIMESTAMP '2026-06-09 11:03:48.86273', 'You accepted a bid from Test Transporter for your load ''Steel''. Trip will begin shortly.', FALSE, 'Transporter Assigned', 'TRIP', 3);
INSERT INTO O_87 VALUES(65, TIMESTAMP '2026-06-09 11:17:47.896274', U&'Test Transporter placed a bid of \20b918000.0 on your load: Steel (Mumbai \2192 Pune)', FALSE, 'New Bid Received', 'BID', 3);
INSERT INTO O_87 VALUES(66, TIMESTAMP '2026-06-09 11:17:48.020529', U&'Congratulations! Your bid of \20b918000.00 for ''Steel'' (Mumbai \2192 Pune) has been accepted. Please assign a driver.', FALSE, U&'\+01f389 Bid Accepted!', 'BID', 4);
INSERT INTO O_87 VALUES(67, TIMESTAMP '2026-06-09 11:17:48.034636', 'You accepted a bid from Test Transporter for your load ''Steel''. Trip will begin shortly.', FALSE, 'Transporter Assigned', 'TRIP', 3);
CREATE TABLE O_25(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR, C23 VARCHAR, C24 VARCHAR, C25 VARCHAR, C26 VARCHAR, C27 VARCHAR, C28 VARCHAR, C29 VARCHAR, C30 VARCHAR, C31 VARCHAR, C32 VARCHAR, C33 VARCHAR, C34 VARCHAR, C35 VARCHAR, C36 VARCHAR);
INSERT INTO O_25 VALUES(NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, NULL, NULL, 0.0, NULL, NULL, NULL, 0.0, 0.0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2);
INSERT INTO O_25 VALUES(NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, NULL, NULL, 0.0, NULL, NULL, NULL, 0.0, 0.0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5);
INSERT INTO O_25 VALUES(NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, NULL, NULL, 0.0, NULL, NULL, NULL, 0.0, 0.0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6);
INSERT INTO O_25 VALUES('https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924117/truckmitra/s0q9hmzxnmxmyxg6txox.jpg', 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924113/truckmitra/wqeyixxs1tucodkdiwvb.jpg', '3505958521267', NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, NULL, 'BRO2-234567890223', NULL, NULL, NULL, TRUE, FALSE, NULL, DATE '2029-10-08', 0.0, 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924102/truckmitra/ki1psscw9m2jxvkiiojw.jpg', 'jxops8806D', NULL, 0.0, 0.0, 0, 0, NULL, NULL, 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924176/truckmitra/on2ustuzs6b0cnkwgrjd.jpg', '24', 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924170/truckmitra/uc2rtjd7vjcmoukv25up.jpg', 'DIESEL', 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924163/truckmitra/oznsg7pk8yez6rrtqmzj.jpg', 'MH05-BH 0945', 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924158/truckmitra/gpooukzkyvnb5x3iebvv.jpg', 7);
INSERT INTO O_25 VALUES(NULL, NULL, 'AAD-9414535788', NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, NULL, 'DL-9414535788', NULL, NULL, NULL, TRUE, FALSE, NULL, NULL, 0.0, NULL, 'PAN-9414535788', NULL, 0.0, 0.0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 71);
INSERT INTO O_25 VALUES('http://cloudinary.com/back.jpg', 'http://cloudinary.com/front.jpg', '123456789012', NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, 'http://cloudinary.com/dl.jpg', 'DL-123456789', NULL, NULL, NULL, TRUE, FALSE, NULL, NULL, 0.0, 'http://cloudinary.com/pan.jpg', 'ABCDE1234F', NULL, 0.0, 0.0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 72);
INSERT INTO O_25 VALUES('http://cloudinary.com/back.jpg', 'http://cloudinary.com/front.jpg', '123456789012', NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, 'http://cloudinary.com/dl.jpg', 'DL-123456789', NULL, NULL, NULL, TRUE, FALSE, NULL, NULL, 0.0, 'http://cloudinary.com/pan.jpg', 'ABCDE1234F', NULL, 0.0, 0.0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 73);
INSERT INTO O_25 VALUES(NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, NULL, NULL, 0.0, NULL, NULL, 'PICKUP', 0.0, 0.0, 0, 0, NULL, NULL, NULL, '15 Tons', NULL, NULL, NULL, 'MH05YZ1111', NULL, 135);
INSERT INTO O_25 VALUES(NULL, NULL, NULL, NULL, NULL, TRUE, TRUE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, FALSE, NULL, NULL, 0.0, NULL, NULL, NULL, 0.0, 0.0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 167);
CREATE TABLE O_27(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR);
INSERT INTO O_27 VALUES(1, 33, 135, 'PENDING', 'Assigned by transporter', NULL, NULL, TIMESTAMP '2026-06-09 11:03:55.318822', TIMESTAMP '2026-06-09 11:03:55.318822', NULL, NULL, TRUE, FALSE, NULL);
INSERT INTO O_27 VALUES(2, 1, 7, 'ACCEPTED', 'Accepted by driver', NULL, NULL, TIMESTAMP '2026-06-09 11:05:13.527519', TIMESTAMP '2026-06-09 12:25:05.723451', NULL, NULL, TRUE, FALSE, NULL);
INSERT INTO O_27 VALUES(33, 65, 2, 'ACCEPTED', 'Accepted by driver', NULL, NULL, TIMESTAMP '2026-06-09 11:45:45.63518', TIMESTAMP '2026-06-09 12:07:54.954372', NULL, NULL, TRUE, FALSE, NULL);
CREATE TABLE O_32(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR);
INSERT INTO O_32 VALUES(68, 1, '/uploads/mocked_WhatsApp Image 2026-06-09 at 7.32.23 AM.jpeg', 'APPROVED', 'Approved by transporter', TIMESTAMP '2026-06-10 05:46:25.386265', TIMESTAMP '2026-06-10 07:39:31.036366', 39, TIMESTAMP '2026-06-10 05:46:25.387245', TIMESTAMP '2026-06-10 07:39:33.90721', NULL, NULL, TRUE, FALSE, NULL);
CREATE TABLE O_99(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR, C17 VARCHAR, C18 VARCHAR, C19 VARCHAR, C20 VARCHAR, C21 VARCHAR, C22 VARCHAR);
INSERT INTO O_99 VALUES(NULL, NULL, NULL, 0, 0.0, NULL, NULL, NULL, 'Test Shipper Co', 2, NULL, NULL, NULL, FALSE, NULL, NULL, NULL, NULL, NULL, 0, 0, 0.0, 3);
INSERT INTO O_99 VALUES('https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924392/truckmitra/uncxhkxzcaug37hbz2qi.jpg', 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924387/truckmitra/qsvp8dhuqpcxdbrwnws0.jpg', '3505958521245', 0, 0.0, NULL, 'MANUFACTURING', NULL, 'tcs', 2, NULL, '22AAGR2345Q6', 'FMCF', FALSE, 'https://res.cloudinary.com/dmtrmiad3/image/upload/v1780924376/truckmitra/fi8j9lkytfvw9pwqfk9r.jpg', 'jxops88063', NULL, NULL, NULL, 0, 0, 0.0, 8);
CREATE TABLE O_12(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR, C14 VARCHAR, C15 VARCHAR, C16 VARCHAR);
INSERT INTO O_12 VALUES(1, 'GLOBAL_PLATFORM', 'TruckMitra Logistics', NULL, NULL, NULL, 'TM', '#1E3A8A', TIMESTAMP '2026-06-07 07:16:04.169191', TIMESTAMP '2026-06-07 07:16:04.169191', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
CREATE TABLE O_167(C0 VARCHAR, C1 VARCHAR, C2 VARCHAR, C3 VARCHAR, C4 VARCHAR, C5 VARCHAR, C6 VARCHAR, C7 VARCHAR, C8 VARCHAR, C9 VARCHAR, C10 VARCHAR, C11 VARCHAR, C12 VARCHAR, C13 VARCHAR);
INSERT INTO O_167 VALUES(68, '/uploads/mocked_WhatsApp Image 2026-06-09 at 6.20.59 AM.jpeg', 'POD-TRP-20260609-EBED681A', NULL, NULL, TIMESTAMP '2026-06-10 05:46:25.377301', 1, NULL, 39, NULL, NULL, NULL, TIMESTAMP '2026-06-10 07:39:31.074915', NULL);
---- Schema ----
CREATE USER IF NOT EXISTS "SA" SALT '88c17811c6523b41' HASH '8cea342fe6e0dca84ca6213bd2073d39983949f1c427b99852460d90812be619' ADMIN;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_39E5E172_80E4_4347_B5F7_E02DC8E49142" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_C7DE6A62_79F8_4E5B_A291_AF7FD738A8E1" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_DD91A0F9_84CC_4E84_BF49_17F8444570D3" START WITH 1 RESTART WITH 65 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_5C209A0B_4261_4FAD_8E93_06887A851C22" START WITH 1 RESTART WITH 99 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_907BD640_B71F_4C40_B2EF_EF50BE25EF83" START WITH 1 MAXVALUE 2147483647 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_F73BDABD_C7BC_4570_80AA_DAB4E67B7C4C" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_005FE596_BFEF_4A33_A187_4B2DD6AD9AE4" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_F9487756_0FAC_4ABA_8BEC_26D108733AA9" START WITH 1 RESTART WITH 2 MAXVALUE 2147483647 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_F07460AC_8CB8_4B18_AE6C_5AA5B186F8AA" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_BDD19FD4_0E01_40E1_BE38_A6C251B0D74C" START WITH 1 RESTART WITH 97 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_A699223F_9FDB_4A7C_B5E6_433F52AC6BC2" START WITH 1 RESTART WITH 97 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_1B57C2E6_72C1_48A5_B7B0_BFC3B1584666" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_13D3E9C9_384D_474D_A620_02D193BECF25" START WITH 1 RESTART WITH 1033 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_041ED060_41D6_4BEB_BFB6_F237630BA4C6" START WITH 1 RESTART WITH 97 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_FF84D92D_3F20_43F9_9C98_8A84CABD22C3" START WITH 1 RESTART WITH 99 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_13E61EC6_964C_4C96_AAE1_90A9A05C61AE" START WITH 1 RESTART WITH 1221 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_455206CF_1C3B_47CF_90C9_09D433820813" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_EC946800_5FE4_4463_B0AB_C78F4C8700F0" START WITH 1 RESTART WITH 98 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_FFDABD87_48EB_4147_8C88_91F2B0228122" START WITH 1 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_EA018F26_50EA_485C_8EE7_B46BF9A59D54" START WITH 1 RESTART WITH 97 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_746DBF07_37EC_400F_9DDD_87CFABA2E214" START WITH 1 RESTART WITH 33 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_381B07A1_3811_4352_83EF_5C15FB2DD2E8" START WITH 1 RESTART WITH 199 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_BAD86DD2_D2D3_428D_9AFB_CE3FE8939C24" START WITH 1 RESTART WITH 98 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_265DDF2B_C4E2_4BE4_8115_E9696514D94C" START WITH 1 RESTART WITH 131 BELONGS_TO_TABLE;
CREATE SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_4D67D00F_0E8B_450D_8562_051662EE0490" START WITH 1 MAXVALUE 2147483647 BELONGS_TO_TABLE;
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."flyway_schema_history"(
    "installed_rank" INTEGER NOT NULL,
    "version" CHARACTER VARYING(50),
    "description" CHARACTER VARYING(200) NOT NULL,
    "type" CHARACTER VARYING(20) NOT NULL,
    "script" CHARACTER VARYING(1000) NOT NULL,
    "checksum" INTEGER,
    "installed_by" CHARACTER VARYING(100) NOT NULL,
    "installed_on" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "execution_time" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."DRIVER_DOCUMENTS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_C7DE6A62_79F8_4E5B_A291_AF7FD738A8E1" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "DOCUMENTIMAGEURL" CHARACTER VARYING(255),
    "DOCUMENTNUMBER" CHARACTER VARYING(255) NOT NULL,
    "DOCUMENTTYPE" CHARACTER VARYING(50) NOT NULL,
    "DRIVERID" BIGINT NOT NULL,
    "EXPIRYDATE" DATE,
    "ISEXPIRED" BOOLEAN NOT NULL,
    "ISSUEDATE" DATE,
    "REJECTIONREASON" CHARACTER VARYING(255),
    "VERIFICATIONSTATUS" CHARACTER VARYING(20) NOT NULL,
    "VERIFIEDAT" DATE,
    "VERIFIEDBY" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."ENTERPRISE_SETTINGS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_F9487756_0FAC_4ABA_8BEC_26D108733AA9" NOT NULL,
    "CONFIG_KEY" CHARACTER VARYING(50) NOT NULL,
    "COMPANY_NAME" CHARACTER VARYING(100),
    "COMPANY_LOGO" CHARACTER VARYING,
    "GST_NUMBER" CHARACTER VARYING(20),
    "COMPANY_ADDRESS" CHARACTER VARYING,
    "INVOICE_PREFIX" CHARACTER VARYING(10),
    "THEME_COLORS" CHARACTER VARYING(20),
    "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "COMPANYADDRESS" CHARACTER VARYING(255),
    "COMPANYLOGO" CHARACTER VARYING(255),
    "COMPANYNAME" CHARACTER VARYING(255),
    "GSTNUMBER" CHARACTER VARYING(255),
    "INVOICEPREFIX" CHARACTER VARYING(255),
    "THEMECOLORS" CHARACTER VARYING(255),
    "UPDATEDAT" TIMESTAMP(6)
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."INVOICES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_F07460AC_8CB8_4B18_AE6C_5AA5B186F8AA" NOT NULL,
    "AMOUNT" FLOAT(53),
    "BILLINGADDRESS" CHARACTER VARYING(255),
    "BILLINGDATE" DATE,
    "BILLINGGSTNUMBER" CHARACTER VARYING(255),
    "BILLINGLOGOURL" CHARACTER VARYING(255),
    "CREATEDAT" TIMESTAMP(6),
    "DUEDATE" DATE,
    "GSTAMOUNT" FLOAT(53),
    "GSTRATE" FLOAT(53),
    "INVOICENUMBER" CHARACTER VARYING(255),
    "PDFURL" CHARACTER VARYING(255),
    "PLANNAME" CHARACTER VARYING(255),
    "STATUS" CHARACTER VARYING(255),
    "TOTALAMOUNT" FLOAT(53),
    "SUBSCRIPTION_ID" BIGINT,
    "USER_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."AUDIT_LOGS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_907BD640_B71F_4C40_B2EF_EF50BE25EF83" NOT NULL,
    "ACTION" CHARACTER VARYING(255),
    "MODULE" CHARACTER VARYING(255),
    "DETAILS" CHARACTER VARYING(255),
    "USER_ID" BIGINT,
    "TIMESTAMP" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "IPADDRESS" CHARACTER VARYING(255),
    "USERID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."BILLING_DETAILS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_F73BDABD_C7BC_4570_80AA_DAB4E67B7C4C" NOT NULL,
    "COMPANYADDRESS" CHARACTER VARYING(255),
    "COMPANYNAME" CHARACTER VARYING(255),
    "CREATEDAT" TIMESTAMP(6),
    "GSTNUMBER" CHARACTER VARYING(255),
    "INVOICEPREFIX" CHARACTER VARYING(255),
    "LOGOURL" CHARACTER VARYING(255),
    "THEMECOLORS" CHARACTER VARYING(255),
    "UPDATEDAT" TIMESTAMP(6),
    "USER_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."DRIVERS"(
    "AADHAARBACKIMAGEURL" CHARACTER VARYING(255),
    "AADHAARFRONTIMAGEURL" CHARACTER VARYING(255),
    "AADHAARNUMBER" CHARACTER VARYING(255),
    "ACCOUNTHOLDERNAME" CHARACTER VARYING(255),
    "ACCOUNTNUMBER" CHARACTER VARYING(255),
    "AVAILABLEFORLOCALROUTE" BOOLEAN,
    "AVAILABLEFORLONGROUTE" BOOLEAN,
    "BANKNAME" CHARACTER VARYING(255),
    "CURRENTLATITUDE" FLOAT(53),
    "CURRENTLONGITUDE" FLOAT(53),
    "DRIVINGLICENSEIMAGEURL" CHARACTER VARYING(255),
    "DRIVING_LICENSE_NUMBER" CHARACTER VARYING(255),
    "EMERGENCY_CONTACT_NAME" CHARACTER VARYING(255),
    "EMERGENCY_CONTACT_NUMBER" CHARACTER VARYING(10),
    "IFSCCODE" CHARACTER VARYING(255),
    "ISAVAILABLE" BOOLEAN NOT NULL,
    "ISONTRIP" BOOLEAN NOT NULL,
    "LASTLOCATIONUPDATE" TIMESTAMP(6),
    "LICENSE_EXPIRY_DATE" DATE,
    "MINIMUMADVANCEREQUIRED" FLOAT(53),
    "PANCARDIMAGEURL" CHARACTER VARYING(255),
    "PANNUMBER" CHARACTER VARYING(255),
    "PREFERREDVEHICLETYPE" ENUM('CONTAINER_20', 'CONTAINER_40', 'LCV', 'OPEN_BODY', 'PICKUP', 'REFRIGERATED', 'TIPPER', 'TRAILER', 'TRUCK_10_WHEEL', 'TRUCK_14_WHEEL'),
    "RATING" FLOAT(53),
    "TOTALEARNINGS" FLOAT(53),
    "TOTALRATINGS" INTEGER,
    "TOTALTRIPSCOMPLETED" INTEGER,
    "TRANSPORTER_ID" BIGINT,
    "UPIID" CHARACTER VARYING(255),
    "VEHICLEBACKIMAGEURL" CHARACTER VARYING(255),
    "VEHICLECAPACITY" CHARACTER VARYING(255),
    "VEHICLEFRONTIMAGEURL" CHARACTER VARYING(255),
    "VEHICLEFUELTYPE" CHARACTER VARYING(255),
    "VEHICLEINSURANCEIMAGEURL" CHARACTER VARYING(255),
    "VEHICLENUMBER" CHARACTER VARYING(255),
    "VEHICLEPUCIMAGEURL" CHARACTER VARYING(255),
    "USER_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."DRIVER_ASSIGNMENTS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_DD91A0F9_84CC_4E84_BF49_17F8444570D3" NOT NULL,
    "TRIP_ID" BIGINT NOT NULL,
    "DRIVER_ID" BIGINT NOT NULL,
    "STATUS" CHARACTER VARYING(50) NOT NULL,
    "REMARKS" CHARACTER VARYING(1000),
    "ASSIGNED_AT" TIMESTAMP,
    "RESPONDED_AT" TIMESTAMP,
    "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "CREATED_BY" BIGINT,
    "UPDATED_BY" BIGINT,
    "IS_ACTIVE" BOOLEAN DEFAULT TRUE,
    "IS_DELETED" BOOLEAN DEFAULT FALSE,
    "DELETED_AT" TIMESTAMP
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."RECEIPT_VERIFICATIONS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_5C209A0B_4261_4FAD_8E93_06887A851C22" NOT NULL,
    "TRIP_ID" BIGINT NOT NULL,
    "RECEIPT_URL" CHARACTER VARYING(2083) NOT NULL,
    "STATUS" CHARACTER VARYING(50) NOT NULL,
    "REMARKS" CHARACTER VARYING(1000),
    "UPLOADED_AT" TIMESTAMP,
    "VERIFIED_AT" TIMESTAMP,
    "VERIFIED_BY" BIGINT,
    "CREATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UPDATED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "CREATED_BY" BIGINT,
    "UPDATED_BY" BIGINT,
    "IS_ACTIVE" BOOLEAN DEFAULT TRUE,
    "IS_DELETED" BOOLEAN DEFAULT FALSE,
    "DELETED_AT" TIMESTAMP
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."TRIPS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_EA018F26_50EA_485C_8EE7_B46BF9A59D54" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "CARBONEMISSION" FLOAT(53),
    "COMPLETEDAT" TIMESTAMP(6),
    "CURRENTLAT" FLOAT(53),
    "CURRENTLNG" FLOAT(53),
    "DELIVERYDATE" TIMESTAMP(6),
    "DESTINATION" CHARACTER VARYING(255),
    "DISTANCE" FLOAT(53),
    "DRIVERCHARGES" FLOAT(53),
    "FREIGHTAMOUNT" NUMERIC(38, 2),
    "FUELCOST" FLOAT(53),
    "LASTLOCATIONUPDATE" TIMESTAMP(6),
    "PICKUPDATE" TIMESTAMP(6),
    "PODREFERENCENUMBER" CHARACTER VARYING(255),
    "PODSIGNATUREURL" CHARACTER VARYING(255),
    "PODURL" CHARACTER VARYING(255),
    "SOURCE" CHARACTER VARYING(255),
    "STARTPHOTOURL" CHARACTER VARYING(255),
    "STARTEDAT" TIMESTAMP(6),
    "STATUS" CHARACTER VARYING(50),
    "TOTALTOLLCOST" FLOAT(53),
    "TRIPNUMBER" CHARACTER VARYING(255) NOT NULL,
    "BID_ID" BIGINT NOT NULL,
    "DRIVER_ID" BIGINT,
    "LOAD_ID" BIGINT NOT NULL,
    "SHIPPER_ID" BIGINT NOT NULL,
    "TRANSPORTER_ID" BIGINT NOT NULL,
    "VEHICLE_ID" BIGINT,
    "TRIP_PDF_URL" CHARACTER VARYING(2083),
    "TRIPPDFURL" CHARACTER VARYING(255),
    "ESTIMATEDTRAVELTIMEMINS" INTEGER,
    "TOLLPLAZACOUNT" INTEGER,
    "ESTIMATEDTOLLCOST" FLOAT(53),
    "FUELESTIMATELITERS" FLOAT(53),
    "ASSIGNMENTPDFURL" CHARACTER VARYING(255),
    "FINALINVOICEPDFURL" CHARACTER VARYING(255),
    "PICKUPRECEIPTURL" CHARACTER VARYING(255),
    "DELIVERYRECEIPTURL" CHARACTER VARYING(255),
    "REJECTIONREASON" CHARACTER VARYING(255),
    "SOURCELATITUDE" DOUBLE PRECISION,
    "SOURCELONGITUDE" DOUBLE PRECISION,
    "DESTINATIONLATITUDE" DOUBLE PRECISION,
    "DESTINATIONLONGITUDE" DOUBLE PRECISION,
    "LOCATIONENABLED" BOOLEAN DEFAULT FALSE,
    "REJECTED_BY" BIGINT,
    "REJECTED_AT" TIMESTAMP,
    "REJECTEDAT" TIMESTAMP(6)
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."CHAT_MESSAGES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_39E5E172_80E4_4347_B5F7_E02DC8E49142" NOT NULL,
    "FROM_USER" BIGINT,
    "TO_USER" BIGINT,
    "MESSAGE" CHARACTER VARYING,
    "TIMESTAMP" TIMESTAMP,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "CONTENT" CHARACTER VARYING NOT NULL,
    "ISREAD" BOOLEAN NOT NULL,
    "RECEIVER_ID" BIGINT NOT NULL,
    "SENDER_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."EMERGENCY_ALERTS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_005FE596_BFEF_4A33_A187_4B2DD6AD9AE4" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "LATITUDE" FLOAT(53),
    "LONGITUDE" FLOAT(53),
    "RESOLUTIONNOTES" CHARACTER VARYING(255),
    "STATUS" CHARACTER VARYING(255) NOT NULL,
    "TIMESTAMP" TIMESTAMP(6) NOT NULL,
    "DRIVER_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."LOAD_BIDS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_BDD19FD4_0E01_40E1_BE38_A6C251B0D74C" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "AMOUNT" NUMERIC(38, 2) NOT NULL,
    "COMMENT" CHARACTER VARYING(255),
    "ESTIMATEDDELIVERYDAYS" INTEGER,
    "STATUS" ENUM('ACCEPTED', 'PENDING', 'REJECTED') NOT NULL,
    "VEHICLETYPE" CHARACTER VARYING(255),
    "LOAD_ID" BIGINT NOT NULL,
    "TRANSPORTER_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."LOADS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_A699223F_9FDB_4A7C_B5E6_433F52AC6BC2" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "BUDGET" NUMERIC(38, 2),
    "DESCRIPTION" CHARACTER VARYING(500),
    "DESTINATION" CHARACTER VARYING(255) NOT NULL,
    "ISBIDDINGENABLED" BOOLEAN,
    "MATERIALTYPE" CHARACTER VARYING(255),
    "PICKUPDATE" TIMESTAMP(6),
    "SOURCE" CHARACTER VARYING(255) NOT NULL,
    "STATUS" ENUM('ASSIGNED', 'CANCELLED', 'COMPLETED', 'IN_TRANSIT', 'PENDING'),
    "WEIGHT" FLOAT(53) NOT NULL,
    "SHIPPER_ID" BIGINT,
    "TRANSPORTER_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."LORRY_RECEIPTS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_1B57C2E6_72C1_48A5_B7B0_BFC3B1584666" NOT NULL,
    "GENERATEDAT" TIMESTAMP(6),
    "LRNUMBER" CHARACTER VARYING(255) NOT NULL,
    "PDFURL" CHARACTER VARYING(255),
    "QRCODEURL" CHARACTER VARYING(255),
    "UPDATEDAT" TIMESTAMP(6),
    "TRIP_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."NOTIFICATION_LOGS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_13D3E9C9_384D_474D_A620_02D193BECF25" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "CHANNELTYPE" ENUM('EMAIL', 'PUSH', 'SMS', 'WHATSAPP') NOT NULL,
    "CONTENTBODY" CHARACTER VARYING NOT NULL,
    "DELIVEREDAT" TIMESTAMP(6),
    "ERRORMESSAGE" CHARACTER VARYING(255),
    "RECIPIENTADDRESS" CHARACTER VARYING(255) NOT NULL,
    "RETRYCOUNT" INTEGER,
    "SENTAT" TIMESTAMP(6),
    "STATUS" ENUM('DELIVERED', 'FAILED', 'QUEUED', 'RETRYING', 'SENT') NOT NULL,
    "SUBJECT" CHARACTER VARYING(255) NOT NULL,
    "TEMPLATENAME" CHARACTER VARYING(255) NOT NULL,
    "USERID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."NOTIFICATIONS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_041ED060_41D6_4BEB_BFB6_F237630BA4C6" NOT NULL,
    "CREATEDAT" TIMESTAMP(6),
    "MESSAGE" CHARACTER VARYING(255),
    "READSTATUS" BOOLEAN NOT NULL,
    "TITLE" CHARACTER VARYING(255),
    "TYPE" ENUM('BID', 'LOAD', 'SYSTEM', 'TRIP', 'WALLET'),
    "USER_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."REFRESH_TOKENS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_13E61EC6_964C_4C96_AAE1_90A9A05C61AE" NOT NULL,
    "EXPIRYDATE" TIMESTAMP(6) WITH TIME ZONE NOT NULL,
    "TOKEN" CHARACTER VARYING(255) NOT NULL,
    "USER_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."SHIPPERS"(
    "AADHAARBACKIMAGEURL" CHARACTER VARYING(255),
    "AADHAARFRONTIMAGEURL" CHARACTER VARYING(255),
    "AADHAARNUMBER" CHARACTER VARYING(255),
    "ACTIVELOADS" INTEGER,
    "AVERAGERATING" FLOAT(53),
    "BUSINESSPROOFURL" CHARACTER VARYING(255),
    "BUSINESSTYPE" CHARACTER VARYING(255),
    "COMPANYLOGOURL" CHARACTER VARYING(255),
    "COMPANYNAME" CHARACTER VARYING(255) NOT NULL,
    "FREELOADSREMAINING" INTEGER,
    "GSTCERTIFICATEURL" CHARACTER VARYING(255),
    "GSTNUMBER" CHARACTER VARYING(255),
    "INDUSTRYTYPE" CHARACTER VARYING(255),
    "ISGSTVERIFIED" BOOLEAN,
    "PANCARDIMAGEURL" CHARACTER VARYING(255),
    "PANNUMBER" CHARACTER VARYING(255),
    "SUBSCRIPTIONENDDATE" TIMESTAMP(6),
    "SUBSCRIPTIONPLAN" CHARACTER VARYING(255),
    "SUBSCRIPTIONSTARTDATE" TIMESTAMP(6),
    "TOTALLOADSPOSTED" INTEGER,
    "TOTALRATINGS" INTEGER,
    "TOTALSPENT" FLOAT(53),
    "USER_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."SUBSCRIPTION_PLANS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_455206CF_1C3B_47CF_90C9_09D433820813" NOT NULL,
    "BIDLIMIT" INTEGER,
    "DESCRIPTION" CHARACTER VARYING(255),
    "FLEETLIMIT" INTEGER,
    "HASANALYTICS" BOOLEAN,
    "HASVOICEASSISTANT" BOOLEAN,
    "LOADPOSTLIMIT" INTEGER,
    "NAME" CHARACTER VARYING(255) NOT NULL,
    "PRICE" FLOAT(53)
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."SUBSCRIPTIONPLAN_FEATURES"(
    "SUBSCRIPTIONPLAN_ID" BIGINT NOT NULL,
    "FEATURES" CHARACTER VARYING(255)
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."TRANSACTIONS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_EC946800_5FE4_4463_B0AB_C78F4C8700F0" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "AMOUNT" NUMERIC(15, 2) NOT NULL,
    "APPROVEDAT" TIMESTAMP(6),
    "APPROVEDBY" BIGINT,
    "BANKREFERENCENUMBER" CHARACTER VARYING(255),
    "BIDID" BIGINT,
    "CURRENTBALANCE" NUMERIC(15, 2) NOT NULL,
    "DESCRIPTION" CHARACTER VARYING(500),
    "DIRECTION" CHARACTER VARYING(10) NOT NULL,
    "FAILUREREASON" CHARACTER VARYING(255),
    "FROMUSERID" BIGINT,
    "FROMWALLETID" BIGINT,
    "GATEWAYTRANSACTIONID" CHARACTER VARYING(255),
    "INITIATEDBY" CHARACTER VARYING(255),
    "IPADDRESS" CHARACTER VARYING(255),
    "LOADID" BIGINT,
    "PAYMENTGATEWAY" CHARACTER VARYING(255),
    "PAYMENTMETHOD" CHARACTER VARYING(255),
    "REMARKS" CHARACTER VARYING(255),
    "REQUESTPAYLOAD" CHARACTER VARYING(1000),
    "RESPONSEPAYLOAD" CHARACTER VARYING(1000),
    "RETRYCOUNT" INTEGER,
    "REVERSALREASON" CHARACTER VARYING(255),
    "REVERSEDTRANSACTIONID" BIGINT,
    "SETTLEDAT" TIMESTAMP(6),
    "STATUS" CHARACTER VARYING(20) NOT NULL,
    "TOUSERID" BIGINT,
    "TOWALLETID" BIGINT,
    "TRANSACTIONDATE" TIMESTAMP(6) NOT NULL,
    "TRANSACTIONID" CHARACTER VARYING(30) NOT NULL,
    "TRANSACTIONTYPE" ENUM('ADVANCE_PAYMENT', 'BID_FEE', 'BONUS', 'COMMISSION', 'ESCROW_HOLD', 'ESCROW_RELEASE', 'PENALTY', 'REFUND', 'TRIP_EARNINGS', 'TRIP_PAYMENT', 'WALLET_RECHARGE', 'WITHDRAWAL') NOT NULL,
    "TRIPID" BIGINT,
    "UPITRANSACTIONID" CHARACTER VARYING(255),
    "USERAGENT" CHARACTER VARYING(255),
    "USERID" BIGINT NOT NULL,
    "USERROLE" CHARACTER VARYING(20),
    "WALLETID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."TRANSPORTER_DRIVERS"(
    "TRANSPORTER_ID" BIGINT NOT NULL,
    "DRIVER_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."TRANSPORTER_VEHICLES"(
    "TRANSPORTER_ID" BIGINT NOT NULL,
    "VEHICLE_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."TRANSPORTERS"(
    "AADHAARBACKIMAGEURL" CHARACTER VARYING(255),
    "AADHAARFRONTIMAGEURL" CHARACTER VARYING(255),
    "AADHAARNUMBER" CHARACTER VARYING(255),
    "AGENCYNAME" CHARACTER VARYING(255) NOT NULL,
    "AVERAGEDRIVERRATING" FLOAT(53),
    "AVERAGERATING" FLOAT(53),
    "BIDSWON" INTEGER,
    "BUSINESSCARDURL" CHARACTER VARYING(255),
    "COMMISSIONRATE" FLOAT(53),
    "EXPERIENCEINYEARS" INTEGER,
    "FLEETSIZE" INTEGER NOT NULL,
    "FREEBIDSREMAINING" INTEGER,
    "GSTCERTIFICATEURL" CHARACTER VARYING(255),
    "GSTNUMBER" CHARACTER VARYING(255),
    "OFFICEADDRESS" CHARACTER VARYING(255),
    "PANCARDIMAGEURL" CHARACTER VARYING(255),
    "PANNUMBER" CHARACTER VARYING(255),
    "SERVICEAREAS" CHARACTER VARYING(255),
    "SUBSCRIPTIONENDDATE" TIMESTAMP(6),
    "SUBSCRIPTIONPLAN" CHARACTER VARYING(255),
    "SUBSCRIPTIONSTARTDATE" TIMESTAMP(6),
    "TOTALDRIVERRATINGS" INTEGER,
    "TOTALDRIVERS" INTEGER,
    "TOTALEARNINGS" FLOAT(53),
    "TOTALRATINGS" INTEGER,
    "TOTALVEHICLES" INTEGER,
    "USER_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."TRIP_LOCATIONS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_FFDABD87_48EB_4147_8C88_91F2B0228122" NOT NULL,
    "LATITUDE" FLOAT(53),
    "LONGITUDE" FLOAT(53),
    "SPEED" FLOAT(53),
    "TIMESTAMP" TIMESTAMP(6),
    "TRIP_ID" BIGINT NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."USER_SUBSCRIPTIONS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_746DBF07_37EC_400F_9DDD_87CFABA2E214" NOT NULL,
    "AUTORENEW" BOOLEAN,
    "ENDDATE" TIMESTAMP(6),
    "STARTDATE" TIMESTAMP(6),
    "STATUS" CHARACTER VARYING(255),
    "PLAN_ID" BIGINT,
    "USER_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."USERS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_381B07A1_3811_4352_83EF_5C15FB2DD2E8" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "ACCOUNTSTATUS" ENUM('DELETED', 'PENDING_VERIFICATION', 'PROFILE_COMPLETED', 'REGISTERED', 'REJECTED', 'SUSPENDED', 'VERIFIED') NOT NULL,
    "ADDRESS" CHARACTER VARYING(255),
    "AREA" CHARACTER VARYING(255),
    "CITY" CHARACTER VARYING(255),
    "DEVICETOKEN" CHARACTER VARYING(255),
    "EMAIL" CHARACTER VARYING(255),
    "EMAILNOTIFICATIONSENABLED" BOOLEAN,
    "FACEBOOKID" CHARACTER VARYING(255),
    "FAILEDLOGINATTEMPTS" INTEGER,
    "FULLNAME" CHARACTER VARYING(100) NOT NULL,
    "GOOGLEID" CHARACTER VARYING(255),
    "ISEMAILVERIFIED" BOOLEAN,
    "ISFACEBOOKLOGIN" BOOLEAN NOT NULL,
    "ISGOOGLELOGIN" BOOLEAN NOT NULL,
    "ISMOBILEVERIFIED" BOOLEAN NOT NULL,
    "ISPROFILECOMPLETED" BOOLEAN NOT NULL,
    "ISVERIFIED" BOOLEAN NOT NULL,
    "LANDMARK" CHARACTER VARYING(255),
    "LASTLOGINAT" TIMESTAMP(6),
    "LASTLOGINIP" CHARACTER VARYING(255),
    "LASTOTPSENTAT" TIMESTAMP(6),
    "LOCKOUTTIME" TIMESTAMP(6),
    "MOBILE" CHARACTER VARYING(10) NOT NULL,
    "OTPATTEMPTS" INTEGER,
    "PASSWORD" CHARACTER VARYING(255) NOT NULL,
    "PINCODE" CHARACTER VARYING(255),
    "PREFERREDLANGUAGE" CHARACTER VARYING(20),
    "PREFERREDLOGINTYPE" CHARACTER VARYING(255) NOT NULL,
    "PROFILEIMAGEURL" CHARACTER VARYING(255),
    "PUSHNOTIFICATIONSENABLED" BOOLEAN,
    "REFRESHTOKEN" CHARACTER VARYING(255),
    "REGISTEREDAT" TIMESTAMP(6),
    "REGISTEREDIP" CHARACTER VARYING(255),
    "ROLE" ENUM('ADMIN', 'DRIVER', 'SHIPPER', 'TRANSPORTER') NOT NULL,
    "SMSNOTIFICATIONSENABLED" BOOLEAN,
    "STATE" CHARACTER VARYING(255),
    "VERIFIEDAT" TIMESTAMP(6),
    "VERIFIEDBY" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."WALLETS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_265DDF2B_C4E2_4BE4_8115_E9696514D94C" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "CURRENTBALANCE" NUMERIC(15, 2) NOT NULL,
    "DAILYTRANSACTIONCOUNT" INTEGER,
    "DAILYTRANSACTIONLIMIT" NUMERIC(38, 2),
    "ESCROWBALANCE" NUMERIC(15, 2) NOT NULL,
    "FAILEDPINATTEMPTS" INTEGER,
    "ISPINSET" BOOLEAN,
    "LASTTRANSACTIONAT" TIMESTAMP(6),
    "LIFETIMEDEPOSIT" NUMERIC(15, 2) NOT NULL,
    "LIFETIMEEARNINGS" NUMERIC(15, 2) NOT NULL,
    "LIFETIMESPENT" NUMERIC(15, 2) NOT NULL,
    "LIFETIMEWITHDRAWAL" NUMERIC(15, 2) NOT NULL,
    "PERTRANSACTIONLIMIT" NUMERIC(38, 2),
    "PINLOCKUNTIL" TIMESTAMP(6),
    "REMARKS" CHARACTER VARYING(500),
    "USERID" BIGINT NOT NULL,
    "USERROLE" CHARACTER VARYING(20) NOT NULL,
    "WALLETNUMBER" CHARACTER VARYING(20) NOT NULL,
    "WALLETPIN" CHARACTER VARYING(255),
    "WALLETSTATUS" CHARACTER VARYING(20) NOT NULL
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."PROOF_OF_DELIVERY"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_FF84D92D_3F20_43F9_9C98_8A84CABD22C3" NOT NULL,
    "IMAGEURL" CHARACTER VARYING(255),
    "PODREFERENCENUMBER" CHARACTER VARYING(255),
    "REMARKS" CHARACTER VARYING(1000),
    "SIGNATUREURL" CHARACTER VARYING(255),
    "UPLOADEDAT" TIMESTAMP(6),
    "TRIP_ID" BIGINT NOT NULL,
    "UPLOADED_BY" BIGINT,
    "APPROVED_BY" BIGINT,
    "APPROVED_AT" TIMESTAMP,
    "REJECTED_BY" BIGINT,
    "REJECTED_AT" TIMESTAMP,
    "APPROVEDAT" TIMESTAMP(6),
    "REJECTEDAT" TIMESTAMP(6)
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."VEHICLES"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_BAD86DD2_D2D3_428D_9AFB_CE3FE8939C24" NOT NULL,
    "CREATED_AT" TIMESTAMP(6) NOT NULL,
    "CREATED_BY" BIGINT,
    "DELETED_AT" TIMESTAMP(6),
    "IS_ACTIVE" BOOLEAN,
    "IS_DELETED" BOOLEAN,
    "UPDATED_AT" TIMESTAMP(6) NOT NULL,
    "UPDATED_BY" BIGINT,
    "CAPACITY" FLOAT(53) NOT NULL,
    "FITNESSCERTIFICATENUMBER" CHARACTER VARYING(255),
    "FITNESSEXPIRY" DATE,
    "INSURANCEEXPIRY" DATE,
    "INSURANCENUMBER" CHARACTER VARYING(255),
    "ISAVAILABLE" BOOLEAN,
    "MANUFACTURER" CHARACTER VARYING(255),
    "MODEL" CHARACTER VARYING(255),
    "PERMITEXPIRY" DATE,
    "PERMITNUMBER" CHARACTER VARYING(255),
    "POLLUTIONCERTIFICATENUMBER" CHARACTER VARYING(255),
    "POLLUTIONEXPIRY" DATE,
    "RCNUMBER" CHARACTER VARYING(255),
    "VEHICLEBACKIMAGEURL" CHARACTER VARYING(255),
    "VEHICLEFRONTIMAGEURL" CHARACTER VARYING(255),
    "VEHICLENUMBER" CHARACTER VARYING(255) NOT NULL,
    "VEHICLERCIMAGEURL" CHARACTER VARYING(255),
    "VEHICLETYPE" CHARACTER VARYING(255) NOT NULL,
    "TRANSPORTER_ID" BIGINT,
    "DRIVER_ID" BIGINT
);
CREATE CACHED TABLE IF NOT EXISTS "PUBLIC"."TRIP_PHOTOS"(
    "ID" BIGINT GENERATED BY DEFAULT AS IDENTITY SEQUENCE "PUBLIC"."SYSTEM_SEQUENCE_4D67D00F_0E8B_450D_8562_051662EE0490" NOT NULL,
    "TRIP_ID" BIGINT NOT NULL,
    "DRIVER_ID" BIGINT NOT NULL,
    "PHOTO_TYPE" CHARACTER VARYING(20) NOT NULL,
    "PHOTO_URL" CHARACTER VARYING(2083) NOT NULL,
    "UPLOADED_AT" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "UPLOADED_BY" BIGINT,
    "APPROVAL_STATUS" CHARACTER VARYING(255),
    "REJECTION_REASON" CHARACTER VARYING(1000)
);
INSERT INTO "PUBLIC"."USERS" SELECT * FROM O_128;
INSERT INTO "PUBLIC"."flyway_schema_history" SELECT * FROM O_4;
INSERT INTO "PUBLIC"."LOAD_BIDS" SELECT * FROM O_71;
INSERT INTO "PUBLIC"."WALLETS" SELECT * FROM O_136;
INSERT INTO "PUBLIC"."LOADS" SELECT * FROM O_75;
INSERT INTO "PUBLIC"."ENTERPRISE_SETTINGS" SELECT * FROM O_12;
INSERT INTO "PUBLIC"."LORRY_RECEIPTS" SELECT * FROM O_79;
INSERT INTO "PUBLIC"."NOTIFICATION_LOGS" SELECT * FROM O_83;
INSERT INTO "PUBLIC"."NOTIFICATIONS" SELECT * FROM O_87;
INSERT INTO "PUBLIC"."DRIVERS" SELECT * FROM O_25;
INSERT INTO "PUBLIC"."DRIVER_ASSIGNMENTS" SELECT * FROM O_27;
INSERT INTO "PUBLIC"."REFRESH_TOKENS" SELECT * FROM O_95;
INSERT INTO "PUBLIC"."RECEIPT_VERIFICATIONS" SELECT * FROM O_32;
INSERT INTO "PUBLIC"."SHIPPERS" SELECT * FROM O_99;
INSERT INTO "PUBLIC"."SUBSCRIPTION_PLANS" SELECT * FROM O_102;
INSERT INTO "PUBLIC"."PROOF_OF_DELIVERY" SELECT * FROM O_167;
INSERT INTO "PUBLIC"."VEHICLES" SELECT * FROM O_233;
INSERT INTO "PUBLIC"."TRANSACTIONS" SELECT * FROM O_107;
INSERT INTO "PUBLIC"."TRIPS" SELECT * FROM O_44;
INSERT INTO "PUBLIC"."TRANSPORTER_DRIVERS" SELECT * FROM O_111;
INSERT INTO "PUBLIC"."TRANSPORTER_VEHICLES" SELECT * FROM O_112;
INSERT INTO "PUBLIC"."TRANSPORTERS" SELECT * FROM O_113;
INSERT INTO "PUBLIC"."USER_SUBSCRIPTIONS" SELECT * FROM O_124;
DROP TABLE O_128;
DROP TABLE O_32;
DROP TABLE O_99;
DROP TABLE O_4;
DROP TABLE O_102;
DROP TABLE O_71;
DROP TABLE O_167;
DROP TABLE O_136;
DROP TABLE O_233;
DROP TABLE O_75;
DROP TABLE O_107;
DROP TABLE O_44;
DROP TABLE O_12;
DROP TABLE O_111;
DROP TABLE O_79;
DROP TABLE O_112;
DROP TABLE O_113;
DROP TABLE O_83;
DROP TABLE O_87;
DROP TABLE O_25;
DROP TABLE O_27;
DROP TABLE O_124;
DROP TABLE O_95;
CREATE INDEX "PUBLIC"."flyway_schema_history_s_idx" ON "PUBLIC"."flyway_schema_history"("success" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."CONSTRAINT_34_INDEX_F" ON "PUBLIC"."ENTERPRISE_SETTINGS"("CONFIG_KEY" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_AUDIT_USER_ID" ON "PUBLIC"."AUDIT_LOGS"("USER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_AUDIT_ACTION" ON "PUBLIC"."AUDIT_LOGS"("ACTION" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_DRIVER_ASSIGNMENT_TRIP" ON "PUBLIC"."DRIVER_ASSIGNMENTS"("TRIP_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_DRIVER_ASSIGNMENT_DRIVER" ON "PUBLIC"."DRIVER_ASSIGNMENTS"("DRIVER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_RECEIPT_VERIFICATION_TRIP" ON "PUBLIC"."RECEIPT_VERIFICATIONS"("TRIP_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."CONSTRAINT_14C_INDEX_1" ON "PUBLIC"."RECEIPT_VERIFICATIONS"("VERIFIED_BY" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK_MOBILE_INDEX_4" ON "PUBLIC"."USERS"("MOBILE" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK_EMAIL_INDEX_4" ON "PUBLIC"."USERS"("EMAIL" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK_USER_WALLET_INDEX_6" ON "PUBLIC"."WALLETS"("USERID" NULLS FIRST, "USERROLE" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKAJVD8M2U9CMEPY7EX5AOY8J63_INDEX_2" ON "PUBLIC"."TRIPS"("TRIPNUMBER" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_CHAT_FROM_USER" ON "PUBLIC"."CHAT_MESSAGES"("FROM_USER" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_CHAT_TO_USER" ON "PUBLIC"."CHAT_MESSAGES"("TO_USER" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_CHAT_TIMESTAMP" ON "PUBLIC"."CHAT_MESSAGES"("TIMESTAMP" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKDEU6O5FPJ2I016N7QYO4NA0Q0_INDEX_1" ON "PUBLIC"."PROOF_OF_DELIVERY"("APPROVED_BY" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKLJ1K82IXEU4DN8VP6UCP3WHWJ_INDEX_2" ON "PUBLIC"."TRIPS"("BID_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKSTDY3N8BJV14QCHXMW9U8VLUQ_INDEX_A" ON "PUBLIC"."VEHICLES"("DRIVER_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKLWWKYL0X5W3T5G9QKRDB3JVEM_INDEX_C" ON "PUBLIC"."BILLING_DETAILS"("USER_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKGWQUD8GGT742Y8G83KE44QVX_INDEX_5" ON "PUBLIC"."INVOICES"("INVOICENUMBER" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK1CW8JLHNFA3AFCWX633SHTEN3_INDEX_C" ON "PUBLIC"."LORRY_RECEIPTS"("LRNUMBER" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKJA9YQ8B20TI2PQT5VMHTWAQ8_INDEX_C" ON "PUBLIC"."LORRY_RECEIPTS"("TRIP_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_NOTIF_LOG_USER_ID" ON "PUBLIC"."NOTIFICATION_LOGS"("USERID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_STATUS" ON "PUBLIC"."NOTIFICATION_LOGS"("STATUS" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKGHPMFN23VMXFU3SPU3LFG4R2D_INDEX_C" ON "PUBLIC"."REFRESH_TOKENS"("TOKEN" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK7TDCD6AB5WSGOUDNVJ7XF1B7L_INDEX_C" ON "PUBLIC"."REFRESH_TOKENS"("USER_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKOIM1KG8LUW8O6Q3AYHCUP6VTL_INDEX_4" ON "PUBLIC"."SUBSCRIPTION_PLANS"("NAME" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_WALLET_ID" ON "PUBLIC"."TRANSACTIONS"("WALLETID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_TX_USER_ID" ON "PUBLIC"."TRANSACTIONS"("USERID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_TRIP_ID" ON "PUBLIC"."TRANSACTIONS"("TRIPID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_TRANSACTION_DATE" ON "PUBLIC"."TRANSACTIONS"("TRANSACTIONDATE" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_TRANSACTION_TYPE" ON "PUBLIC"."TRANSACTIONS"("TRANSACTIONTYPE" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK6TNFC08O8GQU7NF79GD4CX5UF_INDEX_F" ON "PUBLIC"."TRANSACTIONS"("TRANSACTIONID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKFP737VQUA18T32P7UGII8II0P_INDEX_6" ON "PUBLIC"."PROOF_OF_DELIVERY"("TRIP_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKA8455MP06SNH8RY1UIY7S32D6_INDEX_1" ON "PUBLIC"."USER_SUBSCRIPTIONS"("USER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_MOBILE" ON "PUBLIC"."USERS"("MOBILE" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_EMAIL" ON "PUBLIC"."USERS"("EMAIL" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_ROLE" ON "PUBLIC"."USERS"("ROLE" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKIHPJ74PYEO6DFW5OSDHDQTJA9_INDEX_1" ON "PUBLIC"."PROOF_OF_DELIVERY"("REJECTED_BY" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKIQU4KH39LX0ADGTTV9O4NFGII_INDEX_4" ON "PUBLIC"."USERS"("FACEBOOKID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKJD7FRAW9JVMVJPNG1OBFCO83F_INDEX_4" ON "PUBLIC"."USERS"("GOOGLEID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_WALLET_USER_ID" ON "PUBLIC"."WALLETS"("USERID" NULLS FIRST);
CREATE INDEX "PUBLIC"."IDX_WALLET_STATUS" ON "PUBLIC"."WALLETS"("WALLETSTATUS" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK9J9GIQA6E97NOG975LOCWJBAJ_INDEX_6" ON "PUBLIC"."WALLETS"("WALLETNUMBER" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKAND7MH9IU4KT3N1TN2W9I9OF0_INDEX_A" ON "PUBLIC"."CHAT_MESSAGES"("RECEIVER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKGIQEAP8AYS4LF684X7M0R2729_INDEX_A" ON "PUBLIC"."CHAT_MESSAGES"("SENDER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKI51VQH4HBF3MUG0WLSAC1VJ1A_INDEX_C" ON "PUBLIC"."EMERGENCY_ALERTS"("DRIVER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKOV7SBF640SKSSNL53T3N1O1XS_INDEX_5" ON "PUBLIC"."INVOICES"("SUBSCRIPTION_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKBWR4D4VYQF2BKOETXTT8J9DX7_INDEX_5" ON "PUBLIC"."INVOICES"("USER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK389GRALD20JN8SK3NI5KC3DOQ_INDEX_F" ON "PUBLIC"."LOAD_BIDS"("LOAD_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK7MUBMW3R5OGSCQWDPP542X3QD_INDEX_F" ON "PUBLIC"."LOAD_BIDS"("TRANSPORTER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK1LEB9H2C664L5DMJGU32HHG6C_INDEX_4" ON "PUBLIC"."LOADS"("SHIPPER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKC9W8E42EGWMFELVGNYM1LO6QK_INDEX_4" ON "PUBLIC"."LOADS"("TRANSPORTER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK9Y21ADHXN0AYJHFOCSCQOX7BH_INDEX_5" ON "PUBLIC"."NOTIFICATIONS"("USER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKGO6UQC9CWBTGH6FGH6PM15XXB_INDEX_5" ON "PUBLIC"."SUBSCRIPTIONPLAN_FEATURES"("SUBSCRIPTIONPLAN_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKFFSQ9VMY3UJIYLYFEW1BG5L8M_INDEX_C" ON "PUBLIC"."TRANSPORTER_DRIVERS"("TRANSPORTER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK6N046TXM2IDUX7U4G1S6DLRB1_INDEX_4" ON "PUBLIC"."TRANSPORTER_VEHICLES"("TRANSPORTER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKL791PJ54G4OXD3I8K07BR3ES3_INDEX_4" ON "PUBLIC"."TRIP_LOCATIONS"("TRIP_ID" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UKJ6NSI5RIU1FY3HADWSBQ8PEFW_INDEX_B" ON "PUBLIC"."VEHICLES"("VEHICLENUMBER" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKJDHFR171BMORRRTPPSW21XG4H_INDEX_B" ON "PUBLIC"."VEHICLES"("TRANSPORTER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKGVWF73XTK31H777LQ0WVK7U0W_INDEX_1" ON "PUBLIC"."USER_SUBSCRIPTIONS"("PLAN_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK351JLJUOLUKJA1JIXIBJ7OVX1_INDEX_1" ON "PUBLIC"."PROOF_OF_DELIVERY"("UPLOADED_BY" NULLS FIRST);
CREATE INDEX "PUBLIC"."FK92W2CEU5WMG3ULJYB81TXS3KL_INDEX_6" ON "PUBLIC"."TRIP_PHOTOS"("UPLOADED_BY" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKD8FIWVXIREQNUS5772OTV5E34_INDEX_4" ON "PUBLIC"."TRIPS"("REJECTED_BY" NULLS FIRST);
CREATE UNIQUE NULLS DISTINCT INDEX "PUBLIC"."UK13JOVLDLXPFCMIC8KJA2XCWWM_INDEX_2" ON "PUBLIC"."TRIPS"("LOAD_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."CONSTRAINT_6820_INDEX_5" ON "PUBLIC"."TRIP_PHOTOS"("DRIVER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."CONSTRAINT_682_INDEX_5" ON "PUBLIC"."TRIP_PHOTOS"("TRIP_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKQAHSAODJIRBK4IF91C9BFNLGG_INDEX_2" ON "PUBLIC"."TRIPS"("VEHICLE_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKAQ8AOB3MYMSVMH1FKKO7K9QL9_INDEX_2" ON "PUBLIC"."TRIPS"("DRIVER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKN2PFB9R57JGJO76M9Y0GB8NV2_INDEX_2" ON "PUBLIC"."TRIPS"("SHIPPER_ID" NULLS FIRST);
CREATE INDEX "PUBLIC"."FKE87NG3C97V92UCV42HCS538G6_INDEX_2" ON "PUBLIC"."TRIPS"("TRANSPORTER_ID" NULLS FIRST);
ALTER TABLE "PUBLIC"."flyway_schema_history" ADD CONSTRAINT "PUBLIC"."flyway_schema_history_pk" PRIMARY KEY("installed_rank") INDEX "PUBLIC"."PRIMARY_KEY_6";
ALTER TABLE "PUBLIC"."ENTERPRISE_SETTINGS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_3" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_FD2";
ALTER TABLE "PUBLIC"."ENTERPRISE_SETTINGS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_34" UNIQUE NULLS DISTINCT ("CONFIG_KEY") INDEX "PUBLIC"."CONSTRAINT_34_INDEX_F";
ALTER TABLE "PUBLIC"."AUDIT_LOGS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_8" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_4D";
ALTER TABLE "PUBLIC"."DRIVER_DOCUMENTS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_85" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_8";
ALTER TABLE "PUBLIC"."DRIVER_ASSIGNMENTS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_99" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_CEC";
ALTER TABLE "PUBLIC"."RECEIPT_VERIFICATIONS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_1" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_1";
ALTER TABLE "PUBLIC"."USERS" ADD CONSTRAINT "PUBLIC"."UK_MOBILE" UNIQUE NULLS DISTINCT ("MOBILE") INDEX "PUBLIC"."UK_MOBILE_INDEX_4";
ALTER TABLE "PUBLIC"."USERS" ADD CONSTRAINT "PUBLIC"."UK_EMAIL" UNIQUE NULLS DISTINCT ("EMAIL") INDEX "PUBLIC"."UK_EMAIL_INDEX_4";
ALTER TABLE "PUBLIC"."WALLETS" ADD CONSTRAINT "PUBLIC"."UK_USER_WALLET" UNIQUE NULLS DISTINCT ("USERID", "USERROLE") INDEX "PUBLIC"."UK_USER_WALLET_INDEX_6";
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_4C6" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_2ED";
ALTER TABLE "PUBLIC"."BILLING_DETAILS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_C" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_C";
ALTER TABLE "PUBLIC"."CHAT_MESSAGES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_A" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_6A5";
ALTER TABLE "PUBLIC"."DRIVERS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_9" PRIMARY KEY("USER_ID") INDEX "PUBLIC"."PRIMARY_KEY_9";
ALTER TABLE "PUBLIC"."EMERGENCY_ALERTS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_CC" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_CC";
ALTER TABLE "PUBLIC"."INVOICES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_5" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_5";
ALTER TABLE "PUBLIC"."LOAD_BIDS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_FA" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_FA";
ALTER TABLE "PUBLIC"."LOADS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_4" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_4";
ALTER TABLE "PUBLIC"."LORRY_RECEIPTS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_C1" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_C1";
ALTER TABLE "PUBLIC"."NOTIFICATION_LOGS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_9F" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_9F";
ALTER TABLE "PUBLIC"."NOTIFICATIONS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_59" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_59";
ALTER TABLE "PUBLIC"."REFRESH_TOKENS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_C4" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_C4";
ALTER TABLE "PUBLIC"."SHIPPERS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_FE" PRIMARY KEY("USER_ID") INDEX "PUBLIC"."PRIMARY_KEY_FE";
ALTER TABLE "PUBLIC"."SUBSCRIPTION_PLANS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_4C" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_4C";
ALTER TABLE "PUBLIC"."TRANSACTIONS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_FE9" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_FE9";
ALTER TABLE "PUBLIC"."TRANSPORTERS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_2C" PRIMARY KEY("USER_ID") INDEX "PUBLIC"."PRIMARY_KEY_2C";
ALTER TABLE "PUBLIC"."TRIP_LOCATIONS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_41" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_41";
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."UKAJVD8M2U9CMEPY7EX5AOY8J63" UNIQUE NULLS DISTINCT ("TRIPNUMBER") INDEX "PUBLIC"."UKAJVD8M2U9CMEPY7EX5AOY8J63_INDEX_2";
ALTER TABLE "PUBLIC"."USER_SUBSCRIPTIONS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_19" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_19";
ALTER TABLE "PUBLIC"."USERS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_4D" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_4D4";
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."UKLJ1K82IXEU4DN8VP6UCP3WHWJ" UNIQUE NULLS DISTINCT ("BID_ID") INDEX "PUBLIC"."UKLJ1K82IXEU4DN8VP6UCP3WHWJ_INDEX_2";
ALTER TABLE "PUBLIC"."VEHICLES" ADD CONSTRAINT "PUBLIC"."UKSTDY3N8BJV14QCHXMW9U8VLUQ" UNIQUE NULLS DISTINCT ("DRIVER_ID") INDEX "PUBLIC"."UKSTDY3N8BJV14QCHXMW9U8VLUQ_INDEX_A";
ALTER TABLE "PUBLIC"."WALLETS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_6" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_6D";
ALTER TABLE "PUBLIC"."BILLING_DETAILS" ADD CONSTRAINT "PUBLIC"."UKLWWKYL0X5W3T5G9QKRDB3JVEM" UNIQUE NULLS DISTINCT ("USER_ID") INDEX "PUBLIC"."UKLWWKYL0X5W3T5G9QKRDB3JVEM_INDEX_C";
ALTER TABLE "PUBLIC"."INVOICES" ADD CONSTRAINT "PUBLIC"."UKGWQUD8GGT742Y8G83KE44QVX" UNIQUE NULLS DISTINCT ("INVOICENUMBER") INDEX "PUBLIC"."UKGWQUD8GGT742Y8G83KE44QVX_INDEX_5";
ALTER TABLE "PUBLIC"."LORRY_RECEIPTS" ADD CONSTRAINT "PUBLIC"."UK1CW8JLHNFA3AFCWX633SHTEN3" UNIQUE NULLS DISTINCT ("LRNUMBER") INDEX "PUBLIC"."UK1CW8JLHNFA3AFCWX633SHTEN3_INDEX_C";
ALTER TABLE "PUBLIC"."LORRY_RECEIPTS" ADD CONSTRAINT "PUBLIC"."UKJA9YQ8B20TI2PQT5VMHTWAQ8" UNIQUE NULLS DISTINCT ("TRIP_ID") INDEX "PUBLIC"."UKJA9YQ8B20TI2PQT5VMHTWAQ8_INDEX_C";
ALTER TABLE "PUBLIC"."REFRESH_TOKENS" ADD CONSTRAINT "PUBLIC"."UKGHPMFN23VMXFU3SPU3LFG4R2D" UNIQUE NULLS DISTINCT ("TOKEN") INDEX "PUBLIC"."UKGHPMFN23VMXFU3SPU3LFG4R2D_INDEX_C";
ALTER TABLE "PUBLIC"."REFRESH_TOKENS" ADD CONSTRAINT "PUBLIC"."UK7TDCD6AB5WSGOUDNVJ7XF1B7L" UNIQUE NULLS DISTINCT ("USER_ID") INDEX "PUBLIC"."UK7TDCD6AB5WSGOUDNVJ7XF1B7L_INDEX_C";
ALTER TABLE "PUBLIC"."SUBSCRIPTION_PLANS" ADD CONSTRAINT "PUBLIC"."UKOIM1KG8LUW8O6Q3AYHCUP6VTL" UNIQUE NULLS DISTINCT ("NAME") INDEX "PUBLIC"."UKOIM1KG8LUW8O6Q3AYHCUP6VTL_INDEX_4";
ALTER TABLE "PUBLIC"."TRANSACTIONS" ADD CONSTRAINT "PUBLIC"."UK6TNFC08O8GQU7NF79GD4CX5UF" UNIQUE NULLS DISTINCT ("TRANSACTIONID") INDEX "PUBLIC"."UK6TNFC08O8GQU7NF79GD4CX5UF_INDEX_F";
ALTER TABLE "PUBLIC"."PROOF_OF_DELIVERY" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_1A" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_69A";
ALTER TABLE "PUBLIC"."PROOF_OF_DELIVERY" ADD CONSTRAINT "PUBLIC"."UKFP737VQUA18T32P7UGII8II0P" UNIQUE NULLS DISTINCT ("TRIP_ID") INDEX "PUBLIC"."UKFP737VQUA18T32P7UGII8II0P_INDEX_6";
ALTER TABLE "PUBLIC"."USER_SUBSCRIPTIONS" ADD CONSTRAINT "PUBLIC"."UKA8455MP06SNH8RY1UIY7S32D6" UNIQUE NULLS DISTINCT ("USER_ID") INDEX "PUBLIC"."UKA8455MP06SNH8RY1UIY7S32D6_INDEX_1";
ALTER TABLE "PUBLIC"."USERS" ADD CONSTRAINT "PUBLIC"."UKIQU4KH39LX0ADGTTV9O4NFGII" UNIQUE NULLS DISTINCT ("FACEBOOKID") INDEX "PUBLIC"."UKIQU4KH39LX0ADGTTV9O4NFGII_INDEX_4";
ALTER TABLE "PUBLIC"."USERS" ADD CONSTRAINT "PUBLIC"."UKJD7FRAW9JVMVJPNG1OBFCO83F" UNIQUE NULLS DISTINCT ("GOOGLEID") INDEX "PUBLIC"."UKJD7FRAW9JVMVJPNG1OBFCO83F_INDEX_4";
ALTER TABLE "PUBLIC"."WALLETS" ADD CONSTRAINT "PUBLIC"."UK9J9GIQA6E97NOG975LOCWJBAJ" UNIQUE NULLS DISTINCT ("WALLETNUMBER") INDEX "PUBLIC"."UK9J9GIQA6E97NOG975LOCWJBAJ_INDEX_6";
ALTER TABLE "PUBLIC"."VEHICLES" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_A6" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_B";
ALTER TABLE "PUBLIC"."VEHICLES" ADD CONSTRAINT "PUBLIC"."UKJ6NSI5RIU1FY3HADWSBQ8PEFW" UNIQUE NULLS DISTINCT ("VEHICLENUMBER") INDEX "PUBLIC"."UKJ6NSI5RIU1FY3HADWSBQ8PEFW_INDEX_B";
ALTER TABLE "PUBLIC"."TRIP_PHOTOS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_68" PRIMARY KEY("ID") INDEX "PUBLIC"."PRIMARY_KEY_5E";
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."UK13JOVLDLXPFCMIC8KJA2XCWWM" UNIQUE NULLS DISTINCT ("LOAD_ID") INDEX "PUBLIC"."UK13JOVLDLXPFCMIC8KJA2XCWWM_INDEX_2";
ALTER TABLE "PUBLIC"."DRIVER_ASSIGNMENTS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_99BB" FOREIGN KEY("DRIVER_ID") REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RECEIPT_VERIFICATIONS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_14C" FOREIGN KEY("VERIFIED_BY") INDEX "PUBLIC"."CONSTRAINT_14C_INDEX_1" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."DRIVER_ASSIGNMENTS" ADD CONSTRAINT "PUBLIC"."FKMRLMSNOH37XO7D18OJ8JTOTEW" FOREIGN KEY("DRIVER_ID") REFERENCES "PUBLIC"."DRIVERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."PROOF_OF_DELIVERY" ADD CONSTRAINT "PUBLIC"."FKDEU6O5FPJ2I016N7QYO4NA0Q0" FOREIGN KEY("APPROVED_BY") INDEX "PUBLIC"."FKDEU6O5FPJ2I016N7QYO4NA0Q0_INDEX_1" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."VEHICLES" ADD CONSTRAINT "PUBLIC"."FKAASHPHRWFD4TS511Y8VJ785IA" FOREIGN KEY("DRIVER_ID") REFERENCES "PUBLIC"."DRIVERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."AUDIT_LOGS" ADD CONSTRAINT "PUBLIC"."FKJS4IIMVE3Y0XSSBTVE5YSYEF0" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."BILLING_DETAILS" ADD CONSTRAINT "PUBLIC"."FK88K6P3C5D8JDYBW39VQB3R9QL" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."CHAT_MESSAGES" ADD CONSTRAINT "PUBLIC"."FKAND7MH9IU4KT3N1TN2W9I9OF0" FOREIGN KEY("RECEIVER_ID") INDEX "PUBLIC"."FKAND7MH9IU4KT3N1TN2W9I9OF0_INDEX_A" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."CHAT_MESSAGES" ADD CONSTRAINT "PUBLIC"."FKGIQEAP8AYS4LF684X7M0R2729" FOREIGN KEY("SENDER_ID") INDEX "PUBLIC"."FKGIQEAP8AYS4LF684X7M0R2729_INDEX_A" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."DRIVERS" ADD CONSTRAINT "PUBLIC"."FKFSCPNJT46GCO44XH86L99RXH7" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."EMERGENCY_ALERTS" ADD CONSTRAINT "PUBLIC"."FKI51VQH4HBF3MUG0WLSAC1VJ1A" FOREIGN KEY("DRIVER_ID") INDEX "PUBLIC"."FKI51VQH4HBF3MUG0WLSAC1VJ1A_INDEX_C" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."INVOICES" ADD CONSTRAINT "PUBLIC"."FKOV7SBF640SKSSNL53T3N1O1XS" FOREIGN KEY("SUBSCRIPTION_ID") INDEX "PUBLIC"."FKOV7SBF640SKSSNL53T3N1O1XS_INDEX_5" REFERENCES "PUBLIC"."USER_SUBSCRIPTIONS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."INVOICES" ADD CONSTRAINT "PUBLIC"."FKBWR4D4VYQF2BKOETXTT8J9DX7" FOREIGN KEY("USER_ID") INDEX "PUBLIC"."FKBWR4D4VYQF2BKOETXTT8J9DX7_INDEX_5" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."LOAD_BIDS" ADD CONSTRAINT "PUBLIC"."FK389GRALD20JN8SK3NI5KC3DOQ" FOREIGN KEY("LOAD_ID") INDEX "PUBLIC"."FK389GRALD20JN8SK3NI5KC3DOQ_INDEX_F" REFERENCES "PUBLIC"."LOADS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."LOAD_BIDS" ADD CONSTRAINT "PUBLIC"."FK7MUBMW3R5OGSCQWDPP542X3QD" FOREIGN KEY("TRANSPORTER_ID") INDEX "PUBLIC"."FK7MUBMW3R5OGSCQWDPP542X3QD_INDEX_F" REFERENCES "PUBLIC"."TRANSPORTERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."LOADS" ADD CONSTRAINT "PUBLIC"."FK1LEB9H2C664L5DMJGU32HHG6C" FOREIGN KEY("SHIPPER_ID") INDEX "PUBLIC"."FK1LEB9H2C664L5DMJGU32HHG6C_INDEX_4" REFERENCES "PUBLIC"."SHIPPERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."LOADS" ADD CONSTRAINT "PUBLIC"."FKC9W8E42EGWMFELVGNYM1LO6QK" FOREIGN KEY("TRANSPORTER_ID") INDEX "PUBLIC"."FKC9W8E42EGWMFELVGNYM1LO6QK_INDEX_4" REFERENCES "PUBLIC"."TRANSPORTERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."NOTIFICATIONS" ADD CONSTRAINT "PUBLIC"."FK9Y21ADHXN0AYJHFOCSCQOX7BH" FOREIGN KEY("USER_ID") INDEX "PUBLIC"."FK9Y21ADHXN0AYJHFOCSCQOX7BH_INDEX_5" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."REFRESH_TOKENS" ADD CONSTRAINT "PUBLIC"."FK1LIH5Y2NPSF8U5O3VHDB9Y0OS" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."SHIPPERS" ADD CONSTRAINT "PUBLIC"."FK3AEKQ9IE8KEBM7202PYQLSOQS" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."SUBSCRIPTIONPLAN_FEATURES" ADD CONSTRAINT "PUBLIC"."FKGO6UQC9CWBTGH6FGH6PM15XXB" FOREIGN KEY("SUBSCRIPTIONPLAN_ID") INDEX "PUBLIC"."FKGO6UQC9CWBTGH6FGH6PM15XXB_INDEX_5" REFERENCES "PUBLIC"."SUBSCRIPTION_PLANS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRANSPORTER_DRIVERS" ADD CONSTRAINT "PUBLIC"."FKFFSQ9VMY3UJIYLYFEW1BG5L8M" FOREIGN KEY("TRANSPORTER_ID") INDEX "PUBLIC"."FKFFSQ9VMY3UJIYLYFEW1BG5L8M_INDEX_C" REFERENCES "PUBLIC"."TRANSPORTERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRANSPORTER_VEHICLES" ADD CONSTRAINT "PUBLIC"."FK6N046TXM2IDUX7U4G1S6DLRB1" FOREIGN KEY("TRANSPORTER_ID") INDEX "PUBLIC"."FK6N046TXM2IDUX7U4G1S6DLRB1_INDEX_4" REFERENCES "PUBLIC"."TRANSPORTERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRANSPORTERS" ADD CONSTRAINT "PUBLIC"."FK43HLIXRG4TJ79T7R99WQJYGIO" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."USER_SUBSCRIPTIONS" ADD CONSTRAINT "PUBLIC"."FKGVWF73XTK31H777LQ0WVK7U0W" FOREIGN KEY("PLAN_ID") INDEX "PUBLIC"."FKGVWF73XTK31H777LQ0WVK7U0W_INDEX_1" REFERENCES "PUBLIC"."SUBSCRIPTION_PLANS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."USER_SUBSCRIPTIONS" ADD CONSTRAINT "PUBLIC"."FK3L40LBYJI8KJ5XOC20YCWSC8G" FOREIGN KEY("USER_ID") REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."VEHICLES" ADD CONSTRAINT "PUBLIC"."FKJDHFR171BMORRRTPPSW21XG4H" FOREIGN KEY("TRANSPORTER_ID") INDEX "PUBLIC"."FKJDHFR171BMORRRTPPSW21XG4H_INDEX_B" REFERENCES "PUBLIC"."TRANSPORTERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."PROOF_OF_DELIVERY" ADD CONSTRAINT "PUBLIC"."FKIHPJ74PYEO6DFW5OSDHDQTJA9" FOREIGN KEY("REJECTED_BY") INDEX "PUBLIC"."FKIHPJ74PYEO6DFW5OSDHDQTJA9_INDEX_1" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."PROOF_OF_DELIVERY" ADD CONSTRAINT "PUBLIC"."FK351JLJUOLUKJA1JIXIBJ7OVX1" FOREIGN KEY("UPLOADED_BY") INDEX "PUBLIC"."FK351JLJUOLUKJA1JIXIBJ7OVX1_INDEX_1" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIP_PHOTOS" ADD CONSTRAINT "PUBLIC"."FK92W2CEU5WMG3ULJYB81TXS3KL" FOREIGN KEY("UPLOADED_BY") INDEX "PUBLIC"."FK92W2CEU5WMG3ULJYB81TXS3KL_INDEX_6" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."FKD8FIWVXIREQNUS5772OTV5E34" FOREIGN KEY("REJECTED_BY") INDEX "PUBLIC"."FKD8FIWVXIREQNUS5772OTV5E34_INDEX_4" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIP_PHOTOS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_6820" FOREIGN KEY("DRIVER_ID") INDEX "PUBLIC"."CONSTRAINT_6820_INDEX_5" REFERENCES "PUBLIC"."USERS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."RECEIPT_VERIFICATIONS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_14" FOREIGN KEY("TRIP_ID") REFERENCES "PUBLIC"."TRIPS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."DRIVER_ASSIGNMENTS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_99B" FOREIGN KEY("TRIP_ID") REFERENCES "PUBLIC"."TRIPS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."FKQAHSAODJIRBK4IF91C9BFNLGG" FOREIGN KEY("VEHICLE_ID") INDEX "PUBLIC"."FKQAHSAODJIRBK4IF91C9BFNLGG_INDEX_2" REFERENCES "PUBLIC"."VEHICLES"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."LORRY_RECEIPTS" ADD CONSTRAINT "PUBLIC"."FK1W84Q2ESA7JIJW79TWHN13VLT" FOREIGN KEY("TRIP_ID") REFERENCES "PUBLIC"."TRIPS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIP_LOCATIONS" ADD CONSTRAINT "PUBLIC"."FKL791PJ54G4OXD3I8K07BR3ES3" FOREIGN KEY("TRIP_ID") INDEX "PUBLIC"."FKL791PJ54G4OXD3I8K07BR3ES3_INDEX_4" REFERENCES "PUBLIC"."TRIPS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."FKPJX9UCACBPDQ51PD6G0ELC1GP" FOREIGN KEY("BID_ID") REFERENCES "PUBLIC"."LOAD_BIDS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."FKAQ8AOB3MYMSVMH1FKKO7K9QL9" FOREIGN KEY("DRIVER_ID") INDEX "PUBLIC"."FKAQ8AOB3MYMSVMH1FKKO7K9QL9_INDEX_2" REFERENCES "PUBLIC"."DRIVERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."FKRCISWQBVPNEOEBFN7EUVN5D49" FOREIGN KEY("LOAD_ID") REFERENCES "PUBLIC"."LOADS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."FKN2PFB9R57JGJO76M9Y0GB8NV2" FOREIGN KEY("SHIPPER_ID") INDEX "PUBLIC"."FKN2PFB9R57JGJO76M9Y0GB8NV2_INDEX_2" REFERENCES "PUBLIC"."SHIPPERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIPS" ADD CONSTRAINT "PUBLIC"."FKE87NG3C97V92UCV42HCS538G6" FOREIGN KEY("TRANSPORTER_ID") INDEX "PUBLIC"."FKE87NG3C97V92UCV42HCS538G6_INDEX_2" REFERENCES "PUBLIC"."TRANSPORTERS"("USER_ID") NOCHECK;
ALTER TABLE "PUBLIC"."PROOF_OF_DELIVERY" ADD CONSTRAINT "PUBLIC"."FKDON5TYDY8X0C8J1LL507X6VVL" FOREIGN KEY("TRIP_ID") REFERENCES "PUBLIC"."TRIPS"("ID") NOCHECK;
ALTER TABLE "PUBLIC"."TRIP_PHOTOS" ADD CONSTRAINT "PUBLIC"."CONSTRAINT_682" FOREIGN KEY("TRIP_ID") INDEX "PUBLIC"."CONSTRAINT_682_INDEX_5" REFERENCES "PUBLIC"."TRIPS"("ID") NOCHECK;
DROP ALIAS READ_BLOB_MAP;
DROP ALIAS READ_CLOB_MAP;
DROP TABLE IF EXISTS INFORMATION_SCHEMA.LOB_BLOCKS;
