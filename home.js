function loadData() {
  const cardContainer = document.getElementById("card-container");

  cardContainer.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4">
        <span class="loading loading-spinner loading-lg text-secondary"></span>
    </div>
`;

  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((json) => {
      const allIssues = json.data;
      displayData(allIssues);
    });
}

// Display Data function
function displayData(dataList) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  for (let issue of dataList) {
    let borderColor = "";
    if (issue.status === "open") {
      borderColor = "border-green-600";
    } else {
      borderColor = "border-purple-600";
    }

    const statusImg = issue.status === "open" ? "./assets/Open-Status.png" : "./assets/Closed-Status.png";

    const priorityColor =
      issue.priority === "high"
        ? "bg-[#FEECEC] text-[#EF4444]"
        : issue.priority === "medium"
          ? "bg-[#FFF6D1] text-[#F59E0B]"
          : "bg-[#EEEFF2] text-[#9CA3AF]";

    const labelsHTML = issue.labels
      .map((label) => {
        const labelStyles = {
          bug: {
            bg: "bg-[#FEECEC]",
            text: "text-[#EF4444]",
            border: "border-[#FECACA]",
            icon: `<img src="./assets/BugDroid.png" alt="">`,
          },
          "help wanted": {
            bg: "bg-[#FFF8DB]",
            text: "text-[#D97706]",
            border: "border-[#FDE68A]",
            icon: `<img src="./assets/Lifebuoy.png" alt="">`,
          },
          enhancement: {
            bg: "bg-[#E0F2FE]",
            text: "text-[#0284C7]",
            border: "border-[#BAE6FD]",
            icon: "",
          },
        };

        const style = labelStyles[label.toLowerCase()] || {
          bg: "bg-gray-50",
          text: "text-gray-600",
          border: "border-gray-200",
          icon: "",
        };

        return `
        <p class="flex items-center gap-1 py-[6px] px-2 text-[10px] font-medium border ${style.border} ${style.bg} ${style.text} rounded-full">
            ${style.icon} ${label.toUpperCase()}
        </p>
    `;
      })
      .join("");


    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = `
            <div onclick="showDetails(${issue.id})" class="card w-full bg-white shadow-sm border-t-4 ${borderColor} h-full cursor-pointer">
                <div class="p-4 space-y-3">
                    <div class="flex items-center justify-between">
                       <img src="${statusImg}" alt="${issue.status}">
                    <p class="py-1 px-[25px] text-[12px] font-medium ${priorityColor} rounded-full">
                        ${issue.priority.toUpperCase()}
                    </p>
                    </div>
                    <h2 class="text-[14px] font-bold">${issue.title}</h2>
                    <p class="text-[12px] text-[#64748B]">${issue.description.slice(0, 60)}...</p>
                    <div class="flex flex-wrap gap-2">
                    ${labelsHTML}
                    </div>
                </div>
                <div class="py-3 border-t border-gray-100 p-4 mt-auto">
                    <p class="text-[12px] text-gray-400">#${issue.id} by <b>${issue.author}</b></p>
                    <p class="text-[12px] text-gray-400">${issue.createdAt.split("T")[0]}</p>
                </div>
            </div>
        `;
    cardContainer.appendChild(cardDiv);
  }

  document.getElementById("count").innerText = dataList.length;
}

// all buttons filters
const buttons = document.querySelectorAll("section button");
for (let btn of buttons) {
  btn.addEventListener("click", function () {
    const type = btn.innerText.toLowerCase();

    for (let b of buttons) b.classList.remove("bg-[#4A00FF]", "text-white");
    
    btn.classList.add("bg-[#4A00FF]", "text-white");

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
      .then((res) => res.json())
      .then((json) => {
        const allData = json.data;
        if (type === "all") {
          displayData(allData);
        } else {
          const filtered = allData.filter((item) => item.status === type);
          displayData(filtered);
        }
      });
  });
}

// Search function
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search");
searchBtn.addEventListener("click", () => {
  const value = searchInput.value;
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${value}`)
    .then((res) => res.json())
    .then((json) => displayData(json.data));
});

// pop-up modal function
function showDetails(id) {
  fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
    .then((res) => res.json())
    .then((json) => {
      const data = json.data;
      const modalContainer = document.getElementById("my_modal_1");

      const statusBg = data.status === "open" ? "bg-[#10B981]" : "bg-[#7C3AED]";

      const priorityColor =
        data.priority === "high" ? "bg-[#FEECEC] text-[#EF4444]" : data.priority === "medium" ? "bg-[#FFF6D1] text-[#F59E0B]" : "bg-[#EEEFF2] text-[#9CA3AF]";

      const labelsHTML = data.labels
        .map((label) => {
          const labelStyles = {
            bug: {
              bg: "bg-[#FEECEC]",
              text: "text-[#EF4444]",
              border: "border-[#FECACA]",
              icon: `<img src="./assets/BugDroid.png" alt="">`,
            },
            "help wanted": {
              bg: "bg-[#FFF8DB]",
              text: "text-[#D97706]",
              border: "border-[#FDE68A]",
              icon: `<img src="./assets/Lifebuoy.png" alt="">`,
            },
            enhancement: {
              bg: "bg-[#E0F2FE]",
              text: "text-[#0284C7]",
              border: "border-[#BAE6FD]",
              icon: "",
            },
          };

          const style = labelStyles[label.toLowerCase()] || {
            bg: "bg-gray-50",
            text: "text-gray-600",
            border: "border-gray-200",
            icon: "",
          };

          return `
        <p class="flex items-center gap-1 py-[6px] px-2 text-[10px] font-medium border ${style.border} ${style.bg} ${style.text} rounded-full">
            ${style.icon} ${label.toUpperCase()}
        </p>`;
        
        })
        .join("");

      modalContainer.innerHTML = `
        <div class="modal-box max-w-2xl p-8">
            <h1 class="text-2xl font-bold text-[#1E293B] mb-2">${data.title}</h1>

            <div class="flex items-center gap-2 mb-6 text-sm text-gray-500">
                <span class="${statusBg} text-white px-3 py-1 rounded-full font-medium text-xs capitalize">
                   ${data.status}ed
                </span>
                <span>•</span>
                <span>Opened by <b>${data.author}</b></span>
                <span>•</span>
                <span>${data.createdAt.split("T")[0]}</span>
            </div>

            <div class="flex gap-2 mb-6">
            ${labelsHTML}
            </div>

            <p class="text-[#64748B] text-md leading-relaxed mb-8">
                ${data.description}
            </p>

            <div class="bg-[#F8FAFC] rounded-xl p-6 flex justify-between items-center mb-6">
                <div>
                    <p class="text-gray-400 text-xs mb-1 uppercase font-semibold">Assignee:</p>
                    <p class="font-bold text-[#1E293B] text-lg">${data.author}</p>
                </div>
                <div>
                    <p class="text-gray-400 text-xs mb-1 text-right uppercase font-semibold">Priority:</p>
                    <p class="py-1 px-[25px] text-[12px] font-medium ${priorityColor} rounded-full">
                        ${data.priority.toUpperCase()}
                    </p>
                </div>
            </div>

            <div class="modal-action">
                <form method="dialog">
                    <button class="btn bg-[#4A00FF] hover:bg-[#3b00cc] text-white px-8 border-none">Close</button>
                </form>
            </div>
        </div>
      `;

      modalContainer.showModal();
    });
};
loadData();
