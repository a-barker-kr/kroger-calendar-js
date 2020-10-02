import * as _const from './constants';
import './date.ext';

export class krogerCalendar {
  public fiscal_start: Date | undefined;
  public fiscal_end: Date | undefined;
  public fiscalYears: any;
  public fiscal_year_periods: any = [];

  startDate: Date = new Date();
  dateSelected: Date | undefined;
  currentDate: Date = new Date();

  constructor() {
    this.buildFiscalCalendar();
  }

  private buildFiscalCalendar() {
    const fiscalYears = [];
    for (let i = _const.EARLIEST_YEAR; i <= _const.LATEST_YEAR; i++) {
      const date : Date = new Date(i, 0, 1);
      const fiscal_start = this.findFiscalStart(date);
      const followingYear = new Date(date.getFullYear() + 1, 0, 1);
      const fiscal_end = this.findFiscalStart(followingYear).addDays(-1);
      const fiscal_periods = this.makePeriods(date);
      const fiscal_weeks = this.makeWeeks(date);
      const fiscal_quarters = [];
      for (let q = 1; q <= 4; q++) {
        const filteredQuarter = fiscal_periods.filter(function (period) {
          return period.quarter === q;
        });
        const that = this;
        filteredQuarter.forEach(function (period: any) {
          period.fiscal_weeks = [];
          period.fiscal_weeks = fiscal_weeks.filter(function (week) {
            if (
              week.week_start_date >= period.period_start_date &&
              week.week_end_date <= period.period_end_date
            ) {
              return week;
            }
          });
        }, that);
        fiscal_quarters.push({
          quarter: q,
          quarter_start_date: filteredQuarter[0].period_start_date,
          quarter_end_date:
            filteredQuarter[filteredQuarter.length - 1].period_end_date,
          periods: filteredQuarter,
        });
      }
      fiscalYears.push({
        fiscalYear: i,
        fiscalYear_start_date: fiscal_start,
        fiscalYear_end_date: fiscal_end,
        fiscal_periods: this.makePeriods(date),
        fiscal_weeks: this.makeWeeks(date),
        fiscal_quarters: fiscal_quarters,
      });
    }
    // return fiscalYears;
    this.fiscalYears = fiscalYears;
  }

  private findFiscalStart(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const firstSunday = this.currentDate.getSunday(firstDayOfYear);
    const firstDayOfWeekOfYear = firstDayOfYear.getDay();
    let daysTilFirstSunday = 0;
    if (firstDayOfWeekOfYear !== 0) {
      daysTilFirstSunday = 7 - firstDayOfWeekOfYear;
    }
    const firstOfFiscal = firstDayOfYear.addDays(
      firstDayOfYear.getDate() + daysTilFirstSunday + 27
    );
    return firstOfFiscal;
  }

  private makePeriods(date: Date) {
    const fiscal_year_periods = [];
    for (let i: number = 0; i < 13; i++) {
      let start: any = this.findFiscalStart(date);
      let end: any = this.findFiscalStart(
        new Date(start.getFullYear() + 1)
      ).addDays(-1);
      if (i === 0) {
        start = start;
        end = start
          .addDays(_const.DAYS_IN_WEEK * _const.PERIOD_WEEKCOUNT)
          .addDays(-1);
      } else {
        start = fiscal_year_periods[i - 1].period_end_date.addDays(1);
        end = start
          .addDays(_const.DAYS_IN_WEEK * _const.PERIOD_WEEKCOUNT)
          .addDays(-1);
      }
      if (i === 12) {
        const followingYear = new Date(date.getFullYear() + 1, 0, 1);
        const fiscal_end = this.findFiscalStart(followingYear).addDays(-1);
        end = fiscal_end;
      }

      const quarter = this.determineQuarterByPeriod(i + 1);
      fiscal_year_periods.push({
        period: i + 1,
        period_start_date: start,
        period_end_date: end,
        fiscal_year: this.findFiscalStart(date).getFullYear(),
        quarter: quarter,
      });
    }
    return fiscal_year_periods;
  }

  private makeWeeks(date: Date) {
    const fiscalStartDate = this.findFiscalStart(date);
    const followingYear = new Date(date.getFullYear() + 1, 0, 1);
    const fiscalEndDate = this.findFiscalStart(followingYear).addDays(-1);
    const fiscalYearWeeks = [];
    // we add one to the end because weeks do not start at 0 when we utitlize math.floor()
    const totalNumberOfFiscalWeeks =
      Math.floor(
        (fiscalEndDate.getTime() - fiscalStartDate.getTime()) /
          (_const.ONE_DAY_MS * _const.DAYS_IN_WEEK)
      ) + 1;
    for (let i = 0; i < totalNumberOfFiscalWeeks; i++) {
      const weekStartDate = this.findFiscalStart(date).addDays(
        i * _const.DAYS_IN_WEEK
      );
      let weekEndDate = weekStartDate.addDays(6);
      if (i === totalNumberOfFiscalWeeks - 1) {
        weekEndDate = fiscalEndDate;
      }
      fiscalYearWeeks.push({
        week: i + 1,
        week_start_date: weekStartDate,
        week_end_date: weekEndDate,
      });
    }
    return fiscalYearWeeks;
  }

  private determineQuarterByPeriod(periodNumber: number) {
    let quarter = 0;
    switch (true) {
      case periodNumber <= 4:
        quarter = 1;
        break;
      case periodNumber <= 7:
        quarter = 2;
        break;
      case periodNumber <= 10:
        quarter = 3;
        break;
      case periodNumber <= 13:
        quarter = 4;
        break;
      default:
        quarter = 1;
        break;
    }
    return quarter;
  }

  private findFiscal(date : Date) {
    // 5th sunday of every year
    this.currentDate = date;
    this.fiscal_start = this.findFiscalStart(this.currentDate);
    const followingYear = new Date(this.currentDate.getFullYear() + 1, 0, 1);
    this.fiscal_end = this.findFiscalStart(followingYear).addDays(-1);
  }

  getFiscalCalendar() {
    return this.fiscalYears;
  }

}
