document.getElementById('url_input').addEventListener('submit', async function(e) {
    // reset old form
    document.getElementById("instrument_selection").innerHTML = "";

    e.preventDefault();
    const status = document.getElementById('status');
    const userInput = document.getElementById('userInput').value;

    try {
        status.textContent = "Processing. This may take a few minutes depending on server inactivity.";

        const response = await fetch('https://songsterrsheets.onrender.com/instruments', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userInput: userInput })
        });

        if (!response.ok) {
            const errorData = await response.json();
            status.textContent = "Error: " + errorData.message;
            return;
        }

        const instrumentNames = await response.json();
        create_instrument_selection_form(instrumentNames);

    } catch (err) {
        console.error(err);
        status.textContent = "Error: " + err;
    }
});

function create_instrument_selection_form(instrument_names) {
    const form = document.getElementById("instrument_selection");

    // add selection label
    const label = document.createElement("label");
    label.setAttribute("for", "instrument_select");
    label.textContent = "Instrument Selection: ";
    form.appendChild(label);

    // create selection interface
    const select = document.createElement("select");
    select.id = "instrument_select";
    select.name = "instrument";

    // create submit button
    const submit = document.createElement("button");
    submit.type = "button";
    submit.id = "submit_instrument";
    submit.textContent = "Convert to .musicxml file";
    submit.addEventListener("click", handleMusicXMLDownload);

    instrument_names.forEach(([title, subtitle], index) => {
        const option = document.createElement("option");

        // if subtitle is empty, show just the title
        // otherwise, add in the subtitle after the title such that the option reads "title [subtitle]"
        option.textContent = subtitle
            ? `${title} [${subtitle}]`
            : title;

        // indexes the option such that the matching #.json note data is easily located
        option.value = index;

        select.appendChild(option);
    });

    form.appendChild(select);
    form.appendChild(submit);
}

async function handleMusicXMLDownload() {
    const status = document.getElementById('status');
    const submittedInstrumentIndex = Number(document.getElementById('instrument_select').value);

    try {
        status.textContent = "Converting instrument data to a .musicxml file.";

        const response = await fetch('https://songsterrsheets.onrender.com/musicxml', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ index: submittedInstrumentIndex })
        });

        if (!response.ok) {
            const errorData = await response.json();
            status.textContent = "Error: " + errorData.message;
            return;
        }



        const select = document.getElementById("instrument_select");
        const rawName = select.selectedOptions[0].textContent;

        const safeName = rawName
            .replace(/[\/\\?%*:|"<>]/g, "")
            .replace(/\s+/g, "_")
            .trim();

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeName}.musicxml`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);

        status.textContent = "Download complete!";





    } catch (err) {
        console.error(err);
        status.textContent = "Error: " + err;
    }
}
