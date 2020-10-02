import {krogerCalendar} from '../index';

test('Kroger Calendar', () => {
    const calendar = new krogerCalendar();
    expect(calendar.getFiscalCalendar()).toBeDefined();
});
