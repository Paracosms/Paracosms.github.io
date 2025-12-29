document.getElementById('url_input').addEventListener('submit', async function(e) {
    // reset old form
    document.getElementById("instrument_selection").innerHTML = "";

    e.preventDefault();
    const status = document.getElementById('status');
    const userInput = document.getElementById('userInput').value;

    try {
        status.textContent = "Processing. This may take a few minutes depending on server inactivity.";

        const response = await fetch('https://songsterrsheets.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userInput: userInput })
        });

        if (!response.ok) {
            status.textContent = "Error Code: " + response.status;
            console.log("error message: " + response.headers);
            return;
        }

        const instrumentNames = await response.json();
        console.log("instrumentNames: ", instrumentNames);
        console.log("isArray: ", Array.isArray(instrumentNames));
        create_instrument_selection_form(instrumentNames);

        // Receive blob and trigger download
        /*
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "result.json";
        a.click();
        window.URL.revokeObjectURL(url);
        status.textContent = "Download ready.";
        */

    } catch (err) {
        console.error(err);
        status.textContent = "Error: " + err;
    }
});

function create_instrument_selection_form(instrument_names) {
    const form = document.getElementById("instrument_selection");

    // Create label
    const label = document.createElement("label");
    label.setAttribute("for", "instrument_select");
    label.textContent = "Instrument Selection: ";
    form.appendChild(label);

    // Create select
    const select = document.createElement("select");
    select.id = "instrument_select";
    select.name = "instrument";

    instrument_names.forEach(([title, subtitle], index) => {
        const option = document.createElement("option");

        // Build display text
        option.textContent = subtitle
            ? `${title} [${subtitle}]`
            : title;

        // Optional: value attribute
        option.value = index;

        select.appendChild(option);
    });

    form.appendChild(select);
}