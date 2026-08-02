# Atulya Banner Manager (WordPress plugin)

Team members ke liye banner change karne ka simple tareeka — **bina coding, bina website chede.**

## Ye karta kya hai
Website ke har banner ki jagah ("slot") ek **fixed link** se judi hui hai, jaise:

```
https://cms.atulyamedilinkpvtltd.shop/wp-content/uploads/atulya-banners/home-cosmetics.jpg
```

Jab koi team member is plugin se nayi image upload karta hai, to plugin **usi fixed link pe file replace** kar deta hai. Link kabhi nahi badalta, isliye website apne aap nayi image dikhane lagti hai — frontend me kuch nahi karna padta.

## Slots (kahan-kahan banner hai)
**Home Page:** Cosmetics, Nutraceuticals, Ayurveda
**Shop Category Pages:** Cosmetics, Nutraceuticals, Ayurveda

## Install kaise karein (ek baar)
1. `atulya-banner-manager.php` file ko ZIP me daalo (ya seedha `wp-content/plugins/` folder me upload karo).
   - ZIP tareeka: WordPress admin → **Plugins → Add New → Upload Plugin** → ZIP chuno → Install → **Activate**.
2. Activate karte hi:
   - `wp-content/uploads/atulya-banners/` folder ban jayega.
   - Aapki current 3 banner images se saare slots apne aap bhar jayenge (kuch blank nahi rahega).

## Roz ka use (team ke liye)
1. WordPress admin me left menu me **"Atulya Banners"** kholo.
2. Jis jagah ka banner badalna hai uska card dhoondo (naam pe likha hai — jaise "Home Page — Cosmetics").
3. **Choose file** → nayi image chuno → **Update this banner**.
4. Ho gaya. Website pe same link pe nayi image live.

**Best image size:** ~1920 × 700 px (chaudi). Bade images auto-optimize/resize ho jaayenge.

## Notes
- Images optimized **JPG** me save hoti hain (fast loading ke liye).
- Upload ke baad agar aapko purani image dikhe, to hard refresh karo (Ctrl/Cmd + Shift + R). Visitors ko 1 minute me nayi dikhne lagegi.
- Plugin ko kaam karne ke liye WordPress user ke paas **"upload files"** permission honi chahiye (Author/Editor/Admin sab ke paas hoti hai).
