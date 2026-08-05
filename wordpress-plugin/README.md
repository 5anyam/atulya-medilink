# Atulya Banner Manager (WordPress plugin)

Team members ke liye banner change karne ka simple tareeka — **bina coding, bina website chede.**

## Ye karta kya hai
Website ke har banner ki jagah ("slot") me ab **4 tak banners** upload ho sakte hain (Banner 1, 2, 3, 4) jo website pe **carousel me apne aap rotate** hote hain. Har banner ek **fixed link** se judა hai, jaise:

```
.../atulya-banners/home-cosmetics-1.jpg   (Banner 1)
.../atulya-banners/home-cosmetics-2.jpg   (Banner 2)  ... -4 tak
```

Jab koi team member upload karta hai, plugin **usi fixed link pe file replace** kar deta hai. Link kabhi nahi badalta — website apne aap nayi image dikhati hai, frontend me kuch nahi karna padta. Jitne banners bharoge utne rotate honge; jo empty chhodoge wo skip ho jayenge.

## Slots (kahan-kahan banner hai)
**Home Page:** Cosmetics, Nutraceuticals, Ayurveda — (home carousel me teeno ke saare banners rotate honge)
**Category Pages:** Cosmetics, Nutraceuticals, Ayurveda — (us category ke page + shop pe rotate honge)

Har slot me **Banner 1–4** ke boxes hain.

## Install kaise karein (ek baar)
1. `atulya-banner-manager.php` file ko ZIP me daalo (ya seedha `wp-content/plugins/` folder me upload karo).
   - ZIP tareeka: WordPress admin → **Plugins → Add New → Upload Plugin** → ZIP chuno → Install → **Activate**.
2. Activate karte hi:
   - `wp-content/uploads/atulya-banners/` folder ban jayega.
   - Aapki current 3 banner images se saare slots apne aap bhar jayenge (kuch blank nahi rahega).

## Roz ka use (team ke liye)
1. WordPress admin me left menu me **"Atulya Banners"** kholo.
2. Jis jagah ka banner chahiye uska card dhoondo (jaise "Home Page — Cosmetics").
3. Us card me **Banner 1 / Banner 2 / Banner 3 / Banner 4** ke boxes hain. Jitne banners chahiye, un boxes me image chuno → **Save Banner** dabao.
4. Ho gaya. Website pe wo banners carousel me rotate hone lagenge.
5. Koi banner hatana ho to uske box me **"Remove"** dabao — wo carousel se hat jayega.

**Note:** Ek banner rakhoge to sirf wahi dikhega (koi rotation nahi). 2–4 rakhoge to rotate honge.

**Best image size:** ~1920 × 700 px (chaudi). Bade images auto-optimize/resize ho jaayenge.

## Notes
- Images optimized **JPG** me save hoti hain (fast loading ke liye).
- Upload ke baad agar aapko purani image dikhe, to hard refresh karo (Ctrl/Cmd + Shift + R). Visitors ko 1 minute me nayi dikhne lagegi.
- Plugin ko kaam karne ke liye WordPress user ke paas **"upload files"** permission honi chahiye (Author/Editor/Admin sab ke paas hoti hai).
