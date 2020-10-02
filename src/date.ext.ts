export {};

declare global {
    interface Date {
        addDays(days: number): Date;
        addYears(years: number): Date;
        getSunday(date: Date): Date;
        isLeapYear(): Boolean;
    }
}

Date.prototype.addDays = function(days) {
    const dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

Date.prototype.addYears = function(years) {
    const dat = new Date(this.valueOf());
    dat.setFullYear(dat.getFullYear() + years);
    return dat;
};

Date.prototype.getSunday = function(inputDate: Date) {
    const d = inputDate;
    const day = d.getDay(),
        diff = d.getDate() - day + (day === 0 ? -6 : 0);
    return new Date(d.setDate(diff));
};

Date.prototype.isLeapYear = function() {
    const year = new Date(this.valueOf()).getFullYear();
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
};