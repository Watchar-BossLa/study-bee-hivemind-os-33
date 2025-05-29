
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

// Bundle analysis script for CI/CD
function analyzeBundleSize() {
  console.log('📦 Starting bundle size analysis...');
  
  // This would integrate with your build process
  // For Vite, we can use rollup-plugin-analyzer
  const bundleAnalyzer = new BundleAnalyzerPlugin({
    analyzerMode: 'json',
    reportFilename: path.join(__dirname, '../dist/bundle-report.json'),
    openAnalyzer: false,
  });
  
  console.log('Bundle analysis configuration ready');
  return bundleAnalyzer;
}

// Size limits (in KB)
const SIZE_LIMITS = {
  total: 1000, // 1MB total bundle size
  chunks: {
    vendor: 500,  // 500KB for vendor chunks
    main: 300,    // 300KB for main app chunk
  }
};

function checkBundleSize(reportPath) {
  try {
    const report = require(reportPath);
    let totalSize = 0;
    let oversizedChunks = [];
    
    // Analyze each chunk
    Object.entries(report.chunks || {}).forEach(([name, chunk]) => {
      const sizeKB = chunk.size / 1024;
      totalSize += sizeKB;
      
      // Check individual chunk limits
      if (name.includes('vendor') && sizeKB > SIZE_LIMITS.chunks.vendor) {
        oversizedChunks.push(`Vendor chunk (${sizeKB.toFixed(1)}KB) exceeds limit (${SIZE_LIMITS.chunks.vendor}KB)`);
      } else if (sizeKB > SIZE_LIMITS.chunks.main) {
        oversizedChunks.push(`${name} chunk (${sizeKB.toFixed(1)}KB) exceeds limit (${SIZE_LIMITS.chunks.main}KB)`);
      }
    });
    
    // Check total size
    if (totalSize > SIZE_LIMITS.total) {
      oversizedChunks.push(`Total bundle size (${totalSize.toFixed(1)}KB) exceeds limit (${SIZE_LIMITS.total}KB)`);
    }
    
    if (oversizedChunks.length > 0) {
      console.error('❌ Bundle size check failed:');
      oversizedChunks.forEach(issue => console.error(`  - ${issue}`));
      process.exit(1);
    } else {
      console.log(`✅ Bundle size check passed (${totalSize.toFixed(1)}KB total)`);
    }
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error.message);
    process.exit(1);
  }
}

module.exports = { analyzeBundleSize, checkBundleSize };
