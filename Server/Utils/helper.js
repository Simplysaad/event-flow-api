exports.joinDateTime=(date, time = "00:00:00")=> {
    const [hours, minutes, seconds = "00"] = time.split(":");
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        seconds
    );
}

