import { useCalendars } from "expo-localization"

export const useLocalization = () => {
    const calendars = useCalendars()
    const uses24HourClock = calendars.some(calendar => calendar.uses24hourClock)


    return {
        uses24HourClock
    }
}