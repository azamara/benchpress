import { DateWrapper } from 'angular2/src/facade/lang';
export class MeasureValues {
    constructor(runIndex, timeStamp, values) {
        this.runIndex = runIndex;
        this.timeStamp = timeStamp;
        this.values = values;
    }
    toJson() {
        return {
            'timeStamp': DateWrapper.toJson(this.timeStamp),
            'runIndex': this.runIndex,
            'values': this.values
        };
    }
}
