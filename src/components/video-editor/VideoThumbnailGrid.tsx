import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoThumbnailProps {
  currentVideoUrl: string;
  onVideoSelect: (videoUrl: string) => void;
}

export const VideoThumbnailGrid = ({ currentVideoUrl, onVideoSelect }: VideoThumbnailProps) => {
  const thumbnails = [
    {
      id: 'elegant-salon',
      thumbnailUrl: '/thumbnail1.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-2',
      thumbnailUrl: '/thumbnail2.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736233233/url2_xr10ft.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-3',
      thumbnailUrl: '/thumbnail3.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736234861/url3_iyjjbr.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-4',
      thumbnailUrl: '/thumbnail4.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236300/url4_muddnk.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-5',
      thumbnailUrl: '/thumbnail5.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236303/url5_xgk1z3.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-6',
      thumbnailUrl: '/thumbnail6.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236299/url6_ktqlxz.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-7',
      thumbnailUrl: '/thumbnail7.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236299/url7_gchodf.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-8',
      thumbnailUrl: '/thumbnail8.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736237222/url8_zra4ez.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-9',
      thumbnailUrl: '/thumbnail9.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736238820/url9_d9aryr.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-10',
      thumbnailUrl: '/thumbnail10.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736238820/url10_foeiqh.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-11',
      thumbnailUrl: '/thumbnail11.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736240943/url11_oiht71.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-12',
      thumbnailUrl: '/thumbnail12.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736240943/url12_xkwu9f.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-13',
      thumbnailUrl: '/thumbnail13.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736240946/url13_kgyxya.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-15',
      thumbnailUrl: '/thumbnail15.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690481/url15_qdhzmr.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-16',
      thumbnailUrl: '/thumbnail16.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url16_n2q85r.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-17',
      thumbnailUrl: '/thumbnail17.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url17_holjst.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-18',
      thumbnailUrl: '/thumbnail18.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url18_zugolq.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-19',
      thumbnailUrl: '/thumbnail19.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url19_hb0pj1.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-20',
      thumbnailUrl: '/thumbnail20.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url20_bqb4kj.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-21',
      thumbnailUrl: '/thumbnail21.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690894/url21_s6mekx.mp4',
      category: 'all'
    }
  ];

  const beautyThumbnails = [
    {
      id: 'thumbnail-22',
      thumbnailUrl: '/thumbnail22.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691225/url22_mrgosa.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-23',
      thumbnailUrl: '/thumbnail23.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691224/url23_vyuifh.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-24',
      thumbnailUrl: '/thumbnail24.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691222/url24_ugk4br.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-25',
      thumbnailUrl: '/thumbnail25.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691227/url25_egevcq.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-26',
      thumbnailUrl: '/thumbnail26.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691222/url26_zzxrh5.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-27',
      thumbnailUrl: '/thumbnail27.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691223/url27_hcgntu.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-28',
      thumbnailUrl: '/thumbnail28.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691223/url28_ayuexa.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-29',
      thumbnailUrl: '/thumbnail29.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691221/url29_ncq7js.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-30',
      thumbnailUrl: '/thumbnail30.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749550/url30_bs7jhg.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-31',
      thumbnailUrl: '/thumbnail31.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749550/url31_dykbkf.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-32',
      thumbnailUrl: '/thumbnail32.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749548/url32_dmtftn.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-33',
      thumbnailUrl: '/thumbnail33.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749550/url33_ijqjfi.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-34',
      thumbnailUrl: '/thumbnail34.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749548/url34_gor3wq.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-35',
      thumbnailUrl: '/thumbnail35.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749550/url35_sexqnp.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-36',
      thumbnailUrl: '/thumbnail36.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749547/url36_aj3ydc.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-37',
      thumbnailUrl: '/thumbnail37.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749547/url37_nhqptu.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-38',
      thumbnailUrl: '/thumbnail38.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749547/url38_zfupom.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-39',
      thumbnailUrl: '/thumbnail39.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749546/url39_oja0o1.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-40',
      thumbnailUrl: '/thumbnail40.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749546/url40_uvnt3l.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-41',
      thumbnailUrl: '/thumbnail41.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749982/url41_u4l9hv.mp4',
      category: 'beauty'
    }
  ];

  const lifestyleThumbnails = [
    {
      id: 'thumbnail-42',
      thumbnailUrl: '/thumbnail42.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749982/url42_dfwpz4.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-43',
      thumbnailUrl: '/thumbnail43.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749981/url43_lxlnoz.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-44',
      thumbnailUrl: '/thumbnail44.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749982/url44_akdgqi.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-45',
      thumbnailUrl: '/thumbnail45.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749983/url45_qxrlgq.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-46',
      thumbnailUrl: '/thumbnail46.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749981/url46_jd8tbd.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-47',
      thumbnailUrl: '/thumbnail47.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749981/url47_ypw6jf.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-48',
      thumbnailUrl: '/thumbnail48.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749978/url48_f18zta.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-49',
      thumbnailUrl: '/thumbnail49.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749977/url49_jds6aa.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-50',
      thumbnailUrl: '/thumbnail50.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749978/url50_wdgpcc.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-51',
      thumbnailUrl: '/thumbnail51.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749977/url51_fzectx.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-52',
      thumbnailUrl: '/thumbnail52.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749978/url52_hxv2s7.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-53',
      thumbnailUrl: '/thumbnail53.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749977/url53_asbbvk.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-54',
      thumbnailUrl: '/thumbnail54.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749976/url54_boccpz.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-55',
      thumbnailUrl: '/thumbnail55.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749975/url55_bq0wcs.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-56',
      thumbnailUrl: '/thumbnail56.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749975/url56_viumbl.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-57',
      thumbnailUrl: '/thumbnail57.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749975/url57_y0s652.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-58',
      thumbnailUrl: '/thumbnail58.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749974/url58_xmm1y3.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-59',
      thumbnailUrl: '/thumbnail59.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818860/url59_rqsuvg.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-60',
      thumbnailUrl: '/thumbnail60.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818859/url60_jjbxfo.mp4',
      category: 'lifestyle'
    },
    {
      id: 'thumbnail-61',
      thumbnailUrl: '/thumbnail61.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818858/url61_ej8gas.mp4',
      category: 'lifestyle'
    }
  ];

  const customThumbnails = [
    {
      id: 'thumbnail-62',
      thumbnailUrl: '/thumbnail62.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818858/url62_vybnd8.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-63',
      thumbnailUrl: '/thumbnail63.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736819546/url63_i3xxkr.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-64',
      thumbnailUrl: '/thumbnail64.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736819581/url64_m9c21j.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-65',
      thumbnailUrl: '/thumbnail65.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736819638/url65_hbytjk.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-66',
      thumbnailUrl: '/thumbnail66.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736819652/url66_vxvosb.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-67',
      thumbnailUrl: '/thumbnail67.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736819652/url67_no78ce.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-68',
      thumbnailUrl: '/thumbnail68.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818856/url68_zzmggt.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-69',
      thumbnailUrl: '/thumbnail69.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818857/url69_y0zmlf.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-70',
      thumbnailUrl: '/thumbnail70.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818860/url70_zllt4w.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-71',
      thumbnailUrl: '/thumbnail71.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818858/url71_gzu8ab.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-72',
      thumbnailUrl: '/thumbnail72.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818858/url72_rqodtl.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-73',
      thumbnailUrl: '/thumbnail73.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818857/url73_b5dmyi.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-74',
      thumbnailUrl: '/thumbnail74.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818856/url74_x3vk4s.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-75',
      thumbnailUrl: '/thumbnail75.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818860/url75_d7tgc8.mp4',
      category: 'custom'
    },
    {
      id: 'thumbnail-76',
      thumbnailUrl: '/thumbnail76.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736818856/url76_rp8ilo.mp4',
      category: 'custom'
    }
  ];

  const handleThumbnailClick = (videoUrl: string) => {
    if (videoUrl) {
      onVideoSelect(videoUrl);
    }
  };

  const categories = ['beauty', 'lifestyle', 'custom'];

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="all" className="flex-1">1/4</TabsTrigger>
        {categories.map((category, index) => (
          <TabsTrigger key={category} value={category} className="flex-1 capitalize">
            {`${index + 2}/4`}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {thumbnails.map((thumbnail) => (
            <Card 
              key={thumbnail.id}
              className={`relative w-full max-w-[80px] md:max-w-[100px] aspect-square cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                currentVideoUrl === thumbnail.videoUrl ? 'ring-2 ring-primary' : ''
              } ${!thumbnail.videoUrl ? 'opacity-50' : ''}`}
              onClick={() => handleThumbnailClick(thumbnail.videoUrl)}
            >
              <img
                src={thumbnail.thumbnailUrl}
                alt={`${thumbnail.id} Video`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors rounded-lg" />
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="beauty">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {beautyThumbnails.map((thumbnail) => (
            <Card 
              key={thumbnail.id}
              className={`relative w-full max-w-[80px] md:max-w-[100px] aspect-square cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                currentVideoUrl === thumbnail.videoUrl ? 'ring-2 ring-primary' : ''
              } ${!thumbnail.videoUrl ? 'opacity-50' : ''}`}
              onClick={() => handleThumbnailClick(thumbnail.videoUrl)}
            >
              <img
                src={thumbnail.thumbnailUrl}
                alt={`${thumbnail.id} Video`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors rounded-lg" />
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="lifestyle">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lifestyleThumbnails.map((thumbnail) => (
            <Card 
              key={thumbnail.id}
              className={`relative w-full max-w-[80px] md:max-w-[100px] aspect-square cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                currentVideoUrl === thumbnail.videoUrl ? 'ring-2 ring-primary' : ''
              } ${!thumbnail.videoUrl ? 'opacity-50' : ''}`}
              onClick={() => handleThumbnailClick(thumbnail.videoUrl)}
            >
              <img
                src={thumbnail.thumbnailUrl}
                alt={`${thumbnail.id} Video`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors rounded-lg" />
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {customThumbnails.map((thumbnail) => (
            <Card 
              key={thumbnail.id}
              className={`relative w-full max-w-[80px] md:max-w-[100px] aspect-square cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
                currentVideoUrl === thumbnail.videoUrl ? 'ring-2 ring-primary' : ''
              } ${!thumbnail.videoUrl ? 'opacity-50' : ''}`}
              onClick={() => handleThumbnailClick(thumbnail.videoUrl)}
            >
              <img
                src={thumbnail.thumbnailUrl}
                alt={`${thumbnail.id} Video`}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors rounded-lg" />
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};