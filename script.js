// script.js

let medHistory = [];

// 약 복용 알림 설정
document.getElementById("setReminderButton").addEventListener("click", function() {
    const medName = document.getElementById("medName").value;
    const medTime = document.getElementById("medTime").value;
    const repeatReminder = document.getElementById("repeatReminder").value;
    let additionalTimes = [];

    if (repeatReminder === "multiple") {
        additionalTimes = document.getElementById("additionalTimes").value.split(',').map(time => time.trim());
    }

    if (!medName || !medTime) {
        Swal.fire("알림 설정 오류", "약 이름과 복용 시간을 모두 입력해주세요.", "error");
        return;
    }

    // 복용 시간 설정
    const [hours, minutes] = medTime.split(":").map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);
    const timeDifference = reminderTime - now;

    if (timeDifference < 0) {
        Swal.fire("알림 설정 오류", "설정된 시간이 이미 지나갔습니다. 다시 설정해주세요.", "error");
        return;
    }

    // 기본 알림 설정
    setReminder(medName, timeDifference);

    // 여러 번 알림 설정
    if (repeatReminder === "multiple") {
        additionalTimes.forEach(time => {
            const [h, m] = time.split(":").map(Number);
            const additionalReminderTime = new Date();
            additionalReminderTime.setHours(h, m, 0, 0);
            const additionalTimeDifference = additionalReminderTime - now;
            if (additionalTimeDifference >= 0) {
                setReminder(medName, additionalTimeDifference);
            }
        });
    }

    Swal.fire("알림 설정 완료", `${medName} 복용 알림이 설정되었습니다.`, "success");
});

// 알림을 설정하는 함수
function setReminder(medName, timeDifference) {
    setTimeout(function() {
        const medInfo = getMedicationInfo(medName);

        Swal.fire({
            title: `${medName} 복용 시간!`,
            text: `효능: ${medInfo.efficacy}\n부작용 경고: ${medInfo.sideEffects}`,
            icon: 'info',
            confirmButtonText: '확인'
        });

        // 복용 이력 저장
        medHistory.push({ name: medName, time: new Date() });
        updateMedHistory();

    }, timeDifference);
}

// 복용 이력 업데이트
function updateMedHistory() {
    const medHistoryList = document.getElementById("medHistory");
    medHistoryList.innerHTML = "";
    medHistory.forEach(item => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.textContent = `${item.name} - 복용 시간: ${item.time.toLocaleString()}`;
        medHistoryList.appendChild(listItem);
    });
}

// 약 이름에 따른 효능 및 부작용 정보를 반환하는 함수
function getMedicationInfo(medName) {
    const medications = {
        "당뇨약": {
            efficacy: "당뇨병 관리에 도움이 되며 혈당을 조절합니다.",
            sideEffects: "저혈당, 구토, 피로감"
        },
        "고혈압약": {
            efficacy: "혈압을 낮추어 고혈압을 관리하는 데 사용됩니다.",
            sideEffects: "어지러움, 피로감, 두통"
        },
        "항히스타민제": {
            efficacy: "알레르기 증상을 완화시켜줍니다.",
            sideEffects: "졸림, 입 마름, 두통"
        },
    };

    return medications[medName] || {
        efficacy: "효능 정보가 없습니다.",
        sideEffects: "부작용 정보가 없습니다."
    };
}