example = {
    name: "jihad week",
    category: "public event",
    venue: "oduduwa hall",
    date: new Date("2024-03-12T12:34Z"),
    schedule: [
        {
            title: "Keynote address",
            handler: "Dr Kasali Rahman",
            description: "The blooming doom",
            time: new Date("2025-05-28T09:00Z"),
            media: [
                {
                    title: "blooming doom.pptx",
                    url: "https://res.cloudinary.com/blooming-doom.pptx"
                }
            ],
            completed: false
        },
        {
            title: "Opening lecture",
            handler: "Prof. MAO Rahman",
            description: "The blooming doom",
            time: new Date("2025-05-28T09:00Z"),
            media: [
                {
                    title: "blooming doom.pptx",
                    url: "https://res.cloudinary.com/blooming-doom.pptx"
                }
            ],
            completed: true
        }
    ]
};

console.log(example);

function joinDateTime(date, time = "00:00:00") {
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
