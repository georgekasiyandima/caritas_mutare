# 📸 How to Add Your Soup Kitchen Images

## 🎯 **Quick Start Guide**

### **Step 1: Prepare Your Images**
1. **Optimize your images**:
   - Resize to **800x600px** for gallery images
   - Keep file size under **200KB**
   - Use **JPEG format** for photos
   - Save with descriptive names like `community-meal-2024.jpg`

### **Step 2: Upload to the Correct Folders**

Place your images in these specific folders:

```
client/public/images/programs/soup-kitchen/
├── gallery/
│   ├── beneficiaries/
│   │   ├── community-meal.jpg          ← Community sharing meals
│   │   ├── seniors-eating.jpg          ← Senior citizens enjoying meals
│   │   └── families-gathering.jpg      ← Families coming together
│   ├── volunteers/
│   │   ├── cooking-team.jpg            ← Volunteers preparing meals
│   │   └── serving-meals.jpg           ← Volunteers serving with care
│   └── events/
│       └── monthly-service.jpg         ← Monthly soup kitchen service
└── hero/
    └── soup-kitchen-main.jpg           ← Main hero image (1200x600px)
```

### **Step 3: Update the Image Gallery**

Edit the file: `client/src/pages/programs/SoupKitchenPage.tsx`

Find this section (around line 42-79):
```tsx
const imageGallery = [
  {
    src: '/images/programs/soup-kitchen/gallery/beneficiaries/community-meal.jpg',
    alt: 'Community members sharing a meal together',
    category: 'Community Meals',
    placeholder: true  ← Change this to false when you add the image
  },
  // ... more images
];
```

**For each image you add:**
1. Change `placeholder: true` to `placeholder: false`
2. Update the `alt` text to describe your specific image
3. Make sure the `src` path matches where you uploaded the file

### **Step 4: Image Naming Convention**

Use this format for your image files:
```
{category}-{description}-{date}.jpg

Examples:
- beneficiaries-community-meal-2024.jpg
- volunteers-cooking-team-2024.jpg
- seniors-enjoying-meal-2024.jpg
```

## 🖼️ **Image Categories & Suggestions**

### **Beneficiaries (People We Serve)**
- **Community Meals**: Groups of people sharing meals together
- **Senior Support**: Elderly community members enjoying meals
- **Family Support**: Families with children at the soup kitchen
- **Youth Engagement**: Young people helping or participating

### **Volunteers (Our Team)**
- **Cooking Team**: Volunteers preparing meals in the kitchen
- **Serving**: Volunteers distributing meals with care
- **Planning**: Volunteers organizing or setting up
- **Team Spirit**: Group photos of volunteers

### **Events (Special Moments)**
- **Monthly Service**: The regular last Friday service
- **Special Events**: Holiday meals or special occasions
- **Community Gathering**: People socializing and connecting
- **Impact Moments**: Before/after or transformation stories

## 📱 **Image Specifications**

### **Gallery Images**
- **Size**: 800x600 pixels
- **Format**: JPEG
- **File Size**: Under 200KB
- **Quality**: High resolution, well-lit photos

### **Hero Images**
- **Size**: 1200x600 pixels
- **Format**: JPEG
- **File Size**: Under 500KB
- **Quality**: High impact, storytelling image

## 🔧 **Technical Tips**

### **Image Optimization Tools**
- **Online**: [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)
- **Desktop**: Photoshop, GIMP, or ImageOptim
- **Mobile**: Use your phone's built-in editing tools

### **Best Practices**
- **Lighting**: Use natural light when possible
- **Composition**: Show people's faces and emotions
- **Authenticity**: Real moments, not posed shots
- **Diversity**: Show different types of people and situations
- **Safety**: Get permission before taking photos

## 🎨 **Visual Storytelling Tips**

### **What Makes a Great Image**
- **Emotion**: Shows joy, community, care, hope
- **Action**: People actively participating
- **Connection**: Human interactions and relationships
- **Impact**: Shows the difference being made
- **Authenticity**: Real moments, genuine expressions

### **Photo Ideas**
- Volunteers serving meals with smiles
- Families sitting together enjoying food
- Senior citizens being cared for
- Children helping or participating
- Community members socializing
- The kitchen team preparing meals
- People expressing gratitude

## 🚀 **Quick Upload Checklist**

- [ ] Images optimized and resized
- [ ] Files saved with descriptive names
- [ ] Images uploaded to correct folders
- [ ] `placeholder: true` changed to `placeholder: false`
- [ ] Alt text updated for each image
- [ ] Images tested on the website
- [ ] Mobile responsiveness checked

## 💡 **Pro Tips**

1. **Start with 3-4 key images** to get the page working
2. **Add more images gradually** as you capture them
3. **Get permission** from people in photos
4. **Tell a story** with your image selection
5. **Show diversity** in age, background, and situations
6. **Capture emotions** - joy, gratitude, community spirit

## 🔄 **After Adding Images**

1. **Test the website** to ensure images load properly
2. **Check mobile view** to see how images look on phones
3. **Verify alt text** for accessibility
4. **Share with the team** for feedback
5. **Plan future photo opportunities** at upcoming events

Remember: **Every image tells a story**. Choose photos that showcase the heart and impact of your Soup Kitchen program! 🌟
