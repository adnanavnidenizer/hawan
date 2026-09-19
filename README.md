# HAWAN Ritual Objects

Statik İngilizce ve Türkçe web sitesi. Kaynak: 19 Eylül 2026 tarihinde kaydedilen https://www.hawan.co/ kök sürümü (V1) ve aynı sitenin /index-tr Türkçe sayfası. Eski /home sayfası kullanılmamıştır.

## Düzenleme

- `index.html`: İngilizce içerik ve bölüm yapısı.
- `index-tr.html`: Orijinal Türkçe içerik ve bölüm yapısı.
- `css/en.css`, `css/tr.css`: Orijinal sayfalarda üretilen stiller; runtime/CDN gerektirmez.
- `css/fonts.css`, `assets/fonts/`: Yerel Cormorant Garamond ve DM Sans.
- `assets/images/`: Orijinal siteden indirilen 15 görsel/logo.
- `js/site.js`: Lightbox ve form davranışı.

Build komutu veya paket kurulumu gerekmez. Klasörü statik HTTP sunucusuyla açın. HTML'e yeni utility sınıfları eklemek otomatik CSS üretmez; ilgili CSS dosyasında stilini de tanımlayın. Mevcut utility stilleri orijinal görsel davranışı korumak için saklandı.

## Durum

İki dilde form validasyonu vardır. Backend henüz seçilmedi: form hiçbir yere e-posta göndermez, veri saklamaz, sahte başarı mesajı göstermez. Footer sosyal/iletişim/şartlar bağlantıları kaynakta olduğu gibi yer tutucudur. Gerçek adresler yayın öncesinde sağlanmalıdır.

`/home`, `/home-tr`, `/index`, `/index-tr` klasörleri doğru dil sayfasına tarayıcı yönlendirmesi içerir. Hosting seçildiğinde HTTP 301 yönlendirmeleri tercih edilmelidir. Kaynak deponun yüklenmesi GoDaddy DNS'ini veya mevcut canlı siteyi değiştirmez.

## GitHub'dan yayın

Bu depo tek kaynak olarak kullanılabilir. Yayın hizmetine GitHub deposu ve main dalı bağlanır; çıktı klasörü depo köküdür, build gerekmez. Ardından hawan.co ve www.hawan.co hizmete eklenir; hizmetin verdiği DNS kayıtları GoDaddy'de uygulanır. E-posta MX/TXT kayıtları korunmalıdır.

Özel depodan GitHub Pages yayını hesap planına bağlıdır. Yayın hizmeti ve olası ücretler kullanıcı tarafından kararlaştırılmadan DNS veya hesap planı değiştirilmez.
