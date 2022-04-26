export default class CoverageResult {
    public totalLines: number = 0;
    public totalCoveredLines: number = 0;
    public linesWithoutCoverage: number[] = [];

    produceString = () => `${this.totalCoveredLines}/${this.totalLines}, ${Math.floor(this.totalCoveredLines / this.totalLines * 100)}%`;
}
