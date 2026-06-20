let payments =
JSON.parse(localStorage.getItem("payments")) || [];

const form =
document.getElementById("paymentForm");

const table =
document.getElementById("paymentTable");

const search =
document.getElementById("search");

const filterMethod =
document.getElementById("filterMethod");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const paymentIdValue =
    document.getElementById("paymentId").value;

    const amountValue =
    document.getElementById("amount").value;

    // Validation 1
    if(amountValue <= 0){

        alert(
        "Amount must be greater than zero."
        );

        return;
    }

    // Validation 2
    const exists =
    payments.some(payment =>

        payment.paymentId ===
        paymentIdValue

    );

    if(exists){

        alert(
        "Payment ID already exists."
        );

        return;
    }

    const payment = {

        paymentId:
        paymentIdValue,

        bookingId:
        document.getElementById("bookingId").value,

        amount:
        amountValue,

        date:
        document.getElementById("date").value,

        method:
        document.getElementById("method").value

    };

    payments.push(payment);

    localStorage.setItem(
        "payments",
        JSON.stringify(payments)
    );

    displayPayments();

    updateStats();

    form.reset();

});

function displayPayments(data = payments){

    table.innerHTML = "";

    if(data.length === 0){

        table.innerHTML = `

        <tr>

            <td colspan="6"
            style="text-align:center;">
            No Payment Records Found
            </td>

        </tr>

        `;

        return;
    }

    data.forEach((payment,index) => {

        table.innerHTML += `

        <tr>

            <td>${payment.paymentId}</td>

            <td>${payment.bookingId}</td>

            <td>₹${Number(payment.amount).toLocaleString()}</td>

            <td>${payment.method}</td>

            <td>${payment.date}</td>

            <td>

                <button
                class="delete-btn"
                onclick="deletePayment(${index})">

                🗑 Delete

                </button>

            </td>

        </tr>

        `;

    });

}

function deletePayment(index){

    if(confirm("Delete this payment?")){

        payments.splice(index,1);

        localStorage.setItem(
            "payments",
            JSON.stringify(payments)
        );

        displayPayments();

        updateStats();

    }

}

function updateStats(){

    let revenue = 0;

    let highest = 0;

    payments.forEach(payment => {

        revenue +=
        Number(payment.amount);

        if(
        Number(payment.amount)
        >
        highest
        ){

            highest =
            Number(payment.amount);

        }

    });

    let average =

    payments.length > 0

    ?

    revenue /
    payments.length

    :

    0;

    document.getElementById(
        "revenue"
    ).textContent =

    "₹" +
    revenue.toLocaleString();

    document.getElementById(
        "paymentsCount"
    ).textContent =

    payments.length;

    document.getElementById(
        "highestPayment"
    ).textContent =

    "₹" +
    highest.toLocaleString();

    document.getElementById(
        "averagePayment"
    ).textContent =

    "₹" +
    average.toLocaleString(
        undefined,
        {
            maximumFractionDigits:2
        }
    );

}

search.addEventListener("keyup", () => {

    const term =
    search.value;

    const filtered =

    payments.filter(payment =>

        payment.bookingId
        .includes(term)

    );

    displayPayments(filtered);

});

filterMethod.addEventListener("change", () => {

    const selected =
    filterMethod.value;

    if(selected === "All"){

        displayPayments();

        return;

    }

    const filtered =

    payments.filter(payment =>

        payment.method === selected

    );

    displayPayments(filtered);

});

displayPayments();

updateStats();