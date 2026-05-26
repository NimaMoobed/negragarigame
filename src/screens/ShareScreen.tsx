// ShareScreen — صفحه‌ی اشتراک‌گذاری اثر تمام‌شده
// در این مرحله: نمایش تصویر + دکمه‌ی Share (Web Share API).
// در Android (Capacitor)، @capacitor/share برای اشتراک سیستمی استفاده می‌شود.

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { T } from '../theme/classic';
import { ScreenBg } from '../components/ScreenBg';
import { AppBar } from '../components/AppBar';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { Icon } from '../components/Icon';
import { getDesignById } from '../data/designs';
import { getValue } from '../lib/storage';

export function ShareScreen() {
  const nav = useNavigate();
  const { designId } = useParams<{ designId: string }>();
  const design = designId ? getDesignById(designId) : undefined;
  const [dataURL, setDataURL] = useState<string | null>(null);

  useEffect(() => {
    if (!designId) return;
    (async () => {
      const saved = await getValue(`design-${designId}`);
      setDataURL(saved);
    })();
  }, [designId]);

  const shareImage = async () => {
    if (!dataURL) return;

    if (Capacitor.isNativePlatform()) {
      // Save to filesystem first then share
      const base64 = dataURL.split(',')[1];
      const fileName = `negargari_${Date.now()}.png`;
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache,
      });
      await Share.share({
        title: 'اثر رنگ‌آمیزی من',
        text:  'با اپ «رنگ‌آمیزی هنر نگارگری ایرانی» ساخته شد',
        url:   result.uri,
        dialogTitle: 'اشتراک‌گذاری اثر',
      });
    } else if (navigator.share) {
      const blob = await (await fetch(dataURL)).blob();
      const file = new File([blob], `negargari_${Date.now()}.png`, { type: 'image/png' });
      await navigator.share({ files: [file], title: 'اثر رنگ‌آمیزی من' }).catch(() => {});
    } else {
      downloadImage();
    }
  };

  const downloadImage = () => {
    if (!dataURL) return;
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `negargari_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ScreenBg>
      <AppBar title="اشتراک‌گذاری" onBack={() => nav(-1)} />

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Preview */}
        <div style={{
          background: T.surface,
          border: `1.5px solid ${T.accent}`,
          borderRadius: T.radius,
          padding: 12,
          boxShadow: T.shadow,
        }}>
          {dataURL ? (
            <img src={dataURL} alt={design?.title}
                 style={{ width: '100%', borderRadius: 8, display: 'block' }} />
          ) : (
            <div style={{ padding: 60, textAlign: 'center', color: T.inkMute }}>
              هنوز چیزی برای اشتراک نداری.<br/>
              ابتدا طرحت را رنگ کن.
            </div>
          )}
        </div>

        {/* Footer watermark info */}
        {dataURL && (
          <div style={{ fontSize: 12, color: T.inkMute, textAlign: 'center' }}>
            ساخته شده با ✨ negargari.app
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton fullWidth onClick={shareImage} icon={<Icon name="share" size={18} color="#fff" />}>
            اشتراک‌گذاری
          </PrimaryButton>
          <GhostButton fullWidth onClick={downloadImage} icon={<Icon name="download" size={18} />}>
            ذخیره در گالری
          </GhostButton>
        </div>
      </div>
    </ScreenBg>
  );
}
