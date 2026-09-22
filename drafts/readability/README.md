# Fotoğraf üzeri metin okunabilirlik örneği

Mevcut önizlemeye uygulanmadı. Yerel adres: /drafts/readability/; İngilizce: en.html.
Alt araç çubuğu öneriyi açıp kapatır ve beş fotoğraf bölümüne geçer.

## İnceleme
1440x900 masaüstü ve 390x844 mobilde beş fotoğraf bölümünün görsel/DOM incelemesi yapıldı. Bu, fotoğrafın her pikselinde ölçülmüş bir WCAG uygunluk sertifikası değildir.

| Bölüm | Masaüstü | Mobil |
|---|---|---|
| Giriş | Açık zemin üzerinde sıcak gri görece iyi; 8.25px üstbaşlık küçük | Gri yazı daha tutarlı, uzun metin ve dar alan sınırlayıcı |
| Organik Tasarım | Beyaz yazı açık kıyafet/duvarda kayboluyor | Kum tonu perde ve duvarla birleşiyor; belirgin sorun |
| Yüzey Dokusu | Kehribar açık gömlekte daha iyi, koyu kumaşta zayıf | Beyaz metnin bir kısmı açık nesneler üzerinde zayıflıyor |
| İşlevsellik | Açık tezgâh üzerinde gri en tutarlı örneklerden; küçük üstbaşlık ahşap üzerinde zayıf | Beyaz metin açık raf/tezgâh üstünde değişken |
| Keyif | Beyaz metin koyu gömlekte iyi, eller ve tezgahta değişken | Kum tonu yüz/pencere/arka plan arasında kayboluyor |

## Ortak çözüm
Yalnızca yazı bloğunu saran %90 opak krem (#f4f1e9) yüzey; koyu sıcak kahverengi (#443a32) metin. Gölge veya tüm fotoğrafı karartan katman yok. Masaüstü üstbaşlık11px, gövde15–17px/400; mobil üstbaşlık10px, gövde14px/400. Başlıkların serif dili korunur.

Standart sRGB alpha bileşimi ve WCAG bağıl parlaklık formülüyle, tamamen siyah fotoğraf üzerinde en düşük teorik kontrast7.84:1; tamamen beyaz fotoğraf üzerinde9.93:1. Bu değerler panel içindeki metne aittir; CTA, navigasyon ve tüm sitenin erişilebilirlik onayı değildir. Normal metin hedefi4.5:1, büyük metin3:1: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

EN/TR taslaklarda beş panelin bölüme sığması ve yatay taşma olmaması kontrol edildi. Önce/sonra düğmesi çalışıyor. Tek CSS ve tek wrapper ile tüm fotoğraf metinlerine uygulanabilir. Fotoğrafın bir kısmını örten panel, okunurluk karşılığında görsel bir tercih gerektirir.

Kaynak sayfalar güncellendiğinde `node drafts/readability/create.cjs` ile örnekler yeniden oluşturulur. Build bu klasörü dağıtıma dahil etmez.
