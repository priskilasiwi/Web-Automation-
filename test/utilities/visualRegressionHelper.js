const fs = require('fs');
const path = require('path');

class VisualRegressionHelper {
  constructor() {
    this.baselineDir = path.join(process.cwd(), 'visual-baseline');
    this.currentDir = path.join(process.cwd(), 'screenshot');
    this.diffDir = path.join(process.cwd(), 'visual-diff');
    this._ensureDirs();
  }

  _ensureDirs() {
    [this.baselineDir, this.currentDir, this.diffDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  getBaselinePath(filename) {
    return path.join(this.baselineDir, filename);
  }

  getCurrentPath(filename) {
    return path.join(this.currentDir, filename);
  }

  getDiffPath(filename) {
    return path.join(this.diffDir, filename);
  }

  hasBaseline(filename) {
    return fs.existsSync(this.getBaselinePath(filename));
  }

  saveAsBaseline(currentFilename, baselineFilename = currentFilename) {
    const currentPath = this.getCurrentPath(currentFilename);
    const baselinePath = this.getBaselinePath(baselineFilename);

    if (fs.existsSync(currentPath)) {
      fs.copyFileSync(currentPath, baselinePath);
      console.log(`Baseline saved: ${baselinePath}`);
    }
  }

  compareImages(filename) {
    const baselinePath = this.getBaselinePath(filename);
    const currentPath = this.getCurrentPath(filename);
    const diffPath = this.getDiffPath(filename);

    if (!fs.existsSync(baselinePath)) {
      return {
        hasBaseline: false,
        match: null,
        matchPercentage: 0,
        message: `No baseline found for ${filename}`
      };
    }

    if (!fs.existsSync(currentPath)) {
      return {
        hasBaseline: true,
        match: false,
        matchPercentage: 0,
        message: `Current screenshot not found: ${filename}`
      };
    }

    const baselineData = fs.readFileSync(baselinePath);
    const currentData = fs.readFileSync(currentPath);

    if (baselineData.equals(currentData)) {
      return {
        hasBaseline: true,
        match: true,
        matchPercentage: 100,
        message: 'Images are identical'
      };
    }

    const baselineSize = baselineData.length;
    const currentSize = currentData.length;
    const sizeDiff = Math.abs(baselineSize - currentSize);
    const avgSize = (baselineSize + currentSize) / 2;
    const matchPercentage = Math.max(0, 100 - (sizeDiff / avgSize * 100));

    return {
      hasBaseline: true,
      match: matchPercentage >= 95,
      matchPercentage: parseFloat(matchPercentage.toFixed(2)),
      message: `Images differ by ${(100 - matchPercentage).toFixed(2)}%`,
      diffPath: fs.existsSync(diffPath) ? diffPath : null
    };
  }
}

module.exports = VisualRegressionHelper;