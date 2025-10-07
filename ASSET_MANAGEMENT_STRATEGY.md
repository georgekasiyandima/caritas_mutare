# 📸 Asset Management Strategy for Caritas Mutare

## 🎯 **Overview**
This document outlines the best practices for managing images, videos, and other media assets for the Caritas Mutare website, ensuring optimal performance, SEO, and user experience.

## 📁 **Recommended Folder Structure**

```
client/
├── public/
│   ├── images/
│   │   ├── programs/
│   │   │   ├── soup-kitchen/
│   │   │   │   ├── hero/
│   │   │   │   │   ├── soup-kitchen-main.jpg
│   │   │   │   │   ├── community-serving.jpg
│   │   │   │   │   └── volunteers-cooking.jpg
│   │   │   │   ├── gallery/
│   │   │   │   │   ├── beneficiaries/
│   │   │   │   │   │   ├── seniors-eating.jpg
│   │   │   │   │   │   ├── families-gathering.jpg
│   │   │   │   │   │   └── youth-serving.jpg
│   │   │   │   │   ├── volunteers/
│   │   │   │   │   │   ├── cooking-team.jpg
│   │   │   │   │   │   └── serving-meals.jpg
│   │   │   │   │   └── events/
│   │   │   │   │       ├── monthly-service-1.jpg
│   │   │   │   │       └── monthly-service-2.jpg
│   │   │   │   └── thumbnails/
│   │   │   │       ├── soup-kitchen-thumb.jpg
│   │   │   │       └── community-meal-thumb.jpg
│   │   │   ├── education/
│   │   │   ├── healthcare/
│   │   │   ├── agriculture/
│   │   │   ├── livelihood/
│   │   │   └── emergency/
│   │   ├── leadership/
│   │   │   ├── director-fr-gumbeze.jpg
│   │   │   ├── bishop-horan.jpg
│   │   │   └── team-photos/
│   │   ├── impact/
│   │   │   ├── before-after/
│   │   │   ├── success-stories/
│   │   │   └── community-transformation/
│   │   ├── events/
│   │   │   ├── 2024/
│   │   │   ├── 2023/
│   │   │   └── annual-reports/
│   │   └── general/
│   │       ├── hero-backgrounds/
│   │       ├── icons/
│   │       └── placeholders/
│   ├── videos/
│   │   ├── programs/
│   │   │   ├── soup-kitchen-demo.mp4
│   │   │   └── community-impact.mp4
│   │   ├── testimonials/
│   │   └── promotional/
│   └── documents/
│       ├── annual-reports/
│       ├── brochures/
│       └── forms/
```

## 🖼️ **Image Optimization Guidelines**

### **File Formats**
- **JPEG**: Photos, complex images with many colors
- **PNG**: Images with transparency, logos, simple graphics
- **WebP**: Modern format for better compression (fallback to JPEG/PNG)
- **SVG**: Logos, icons, simple graphics

### **Image Sizes & Dimensions**

#### **Hero Images**
- **Desktop**: 1920x1080px (16:9 ratio)
- **Tablet**: 1024x768px (4:3 ratio)
- **Mobile**: 768x1024px (3:4 ratio)
- **File Size**: < 500KB

#### **Gallery Images**
- **Full Size**: 1200x800px
- **Thumbnail**: 300x200px
- **File Size**: < 200KB per image

#### **Program Feature Images**
- **Card Images**: 400x300px
- **Feature Images**: 800x600px
- **File Size**: < 150KB

### **Naming Convention**
```
{program}-{category}-{description}-{date}.{extension}

Examples:
- soup-kitchen-hero-community-serving-2024.jpg
- education-program-children-learning-2024.jpg
- healthcare-clinic-medical-care-2024.jpg
```

## 🎥 **Video Guidelines**

### **Video Specifications**
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080p (1920x1080)
- **Frame Rate**: 30fps
- **Duration**: 30-90 seconds for promotional videos
- **File Size**: < 10MB for web videos
- **Thumbnail**: Generate from video (1280x720px)

### **Video Optimization**
- Use video compression tools (HandBrake, FFmpeg)
- Provide multiple quality options
- Include subtitles for accessibility
- Add loading states for better UX

## 🔧 **Technical Implementation**

### **Responsive Images**
```tsx
// Example implementation
const ResponsiveImage = ({ src, alt, ...props }) => (
  <img
    src={`/images/${src}`}
    alt={alt}
    loading="lazy"
    style={{
      width: '100%',
      height: 'auto',
      objectFit: 'cover'
    }}
    {...props}
  />
);
```

### **Image Lazy Loading**
```tsx
// Implement lazy loading for gallery images
<CardMedia
  component="img"
  height="200"
  image="/images/programs/soup-kitchen/gallery/meal-serving.jpg"
  alt="Community meal service"
  loading="lazy"
  sx={{
    objectFit: 'cover',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  }}
/>
```

### **Image Gallery Component**
```tsx
const ImageGallery = ({ images, program }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <Box>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={6} md={3} key={index}>
            <CardMedia
              component="img"
              image={`/images/programs/${program}/gallery/${image.filename}`}
              alt={image.alt}
              onClick={() => setSelectedImage(index)}
              sx={{ cursor: 'pointer', borderRadius: 1 }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
```

## 📱 **Mobile Optimization**

### **Responsive Images**
- Use `srcset` for different screen sizes
- Implement proper aspect ratios
- Optimize for touch interactions
- Consider mobile-first approach

### **Performance Considerations**
- Compress images for mobile (smaller file sizes)
- Use progressive JPEG loading
- Implement image caching strategies
- Consider CDN for global delivery

## 🔍 **SEO & Accessibility**

### **Alt Text Guidelines**
```tsx
// Good alt text examples
<img 
  src="/images/soup-kitchen-community-meal.jpg" 
  alt="Community members sharing a meal at Caritas Mutare Soup Kitchen"
/>

<img 
  src="/images/volunteer-cooking.jpg" 
  alt="Volunteers preparing nutritious meals in the kitchen"
/>
```

### **SEO Best Practices**
- Use descriptive filenames
- Include relevant keywords in alt text
- Implement structured data for images
- Add image sitemaps
- Use proper heading hierarchy

## 🚀 **Future Enhancements**

### **Advanced Features**
1. **Image CDN Integration**
   - Cloudinary or AWS CloudFront
   - Automatic optimization and resizing
   - WebP format delivery

2. **Dynamic Image Loading**
   - Intersection Observer API
   - Progressive image loading
   - Blur-to-sharp transitions

3. **Image Management System**
   - Admin panel for image uploads
   - Automatic optimization
   - Batch processing tools

4. **Analytics Integration**
   - Track image engagement
   - Monitor loading performance
   - User interaction metrics

## 📊 **Performance Monitoring**

### **Key Metrics**
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Image Loading Time**: < 1s on 3G

### **Tools**
- Google PageSpeed Insights
- WebPageTest
- Lighthouse
- GTmetrix

## 🔄 **Workflow Process**

### **Image Upload Process**
1. **Capture/Select**: Choose high-quality images
2. **Optimize**: Resize and compress using tools
3. **Rename**: Follow naming convention
4. **Organize**: Place in correct folder structure
5. **Test**: Verify on different devices
6. **Deploy**: Upload to production

### **Tools for Optimization**
- **Desktop**: Photoshop, GIMP, ImageOptim
- **Online**: TinyPNG, Squoosh, Compressor.io
- **Automation**: Sharp.js, ImageMagick
- **Batch Processing**: XnConvert, IrfanView

## 💡 **Best Practices Summary**

✅ **Do:**
- Use high-quality, authentic images
- Optimize for web performance
- Include descriptive alt text
- Implement lazy loading
- Use responsive images
- Maintain consistent aspect ratios
- Keep file sizes reasonable

❌ **Don't:**
- Use stock photos that don't reflect reality
- Upload uncompressed images
- Forget alt text for accessibility
- Use copyrighted images without permission
- Overload pages with too many images
- Ignore mobile optimization
- Use blurry or low-quality images

This strategy ensures that Caritas Mutare's visual storytelling is powerful, performant, and accessible while maintaining the authentic voice of the organization.
