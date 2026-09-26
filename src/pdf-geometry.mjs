// Bound bitmap memory independently of the user's readable CSS zoom.
export function pdfGeometry(pageWidth,pageHeight,availableWidth,zoom=1,dpr=1){
 const cssWidth=Math.max(1,availableWidth)*Math.max(.25,Math.min(6,zoom));
 const cssHeight=cssWidth*pageHeight/pageWidth;
 const ratio=Math.min(Math.max(1,dpr),2,8192/cssWidth,8192/cssHeight,Math.sqrt(16000000/(cssWidth*cssHeight)));
 return {cssWidth,cssHeight,pixelWidth:Math.max(1,Math.floor(cssWidth*ratio)),pixelHeight:Math.max(1,Math.floor(cssHeight*ratio)),scale:cssWidth/pageWidth*ratio};
}
