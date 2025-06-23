let clickCount = 0
let daysLived = 0
let savedBirthDate = null

// Tarjima vaqtincha o‘chirilgan
async function translateToUzbek(text) {
	return text // Inglizchasini qaytaradi
}

// Resultni ko‘rsatish animatsiyasi bilan
function showResult() {
	const result = document.getElementById('result')
	result.style.display = 'inline-block'
	result.classList.remove('fade-in')
	void result.offsetWidth // Reflow — animatsiyani qayta ishlatish
	result.classList.add('fade-in')
}

async function calculate() {
	const input = document.getElementById('birthDate').value
	const result = document.getElementById('result')
	if (!input && !savedBirthDate) return

	const birthDate = savedBirthDate || new Date(input)
	savedBirthDate = birthDate
	const today = new Date()

	const daysOfWeek = [
		'Yakshanba',
		'Dushanba',
		'Seshanba',
		'Chorshanba',
		'Payshanba',
		'Juma',
		'Shanba',
	]
	const birthDay = daysOfWeek[birthDate.getDay()]

	const diffTime = today - birthDate
	daysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24))

	const nextBirthday = new Date(
		today.getFullYear(),
		birthDate.getMonth(),
		birthDate.getDate()
	)
	if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1)
	const daysLeft = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24))

	const month = birthDate.getMonth() + 1
	const day = birthDate.getDate()

	let extraHTML = ''

	try {
		const eventRes = await fetch(
			`https://byabbe.se/on-this-day/${month}/${day}/events.json`
		)
		const birthRes = await fetch(
			`https://byabbe.se/on-this-day/${month}/${day}/births.json`
		)

		const eventData = await eventRes.json()
		const birthData = await birthRes.json()

		const events = eventData.events
			.filter(e => parseInt(e.year) >= 1800 && parseInt(e.year) <= 2000)
			.slice(0, 3)

		const births = birthData.births
			.filter(b => parseInt(b.year) >= 1800 && parseInt(b.year) <= 2000)
			.slice(0, 3)

		extraHTML += `<br><br><strong>🌍 Siz tug‘ilgan kunda dunyoda (1800–1950):</strong><br>`
		for (const e of events) {
			const translated = await translateToUzbek(e.description)
			extraHTML += `• ${e.year} – ${translated}<br>`
		}

		extraHTML += `<br><strong>👑 Mashhur tug‘ilganlar (1800–1950):</strong><br>`
		for (const b of births) {
			const translated = await translateToUzbek(b.description)
			extraHTML += `• ${b.year} – ${translated}<br>`
		}
	} catch (error) {
		extraHTML += `<br><br>⚠️ API dan ma’lumot olib bo‘lmadi. Keyinroq urinib ko‘ring.`
	}

	if (clickCount === 0) {
		result.innerHTML = `Siz <strong>${birthDay}</strong> kuni tug‘ilgansiz.<br>
      Bugungacha <strong>${daysLived}</strong> kun yashagansiz.<br>
      Yana <strong>${daysLeft}</strong> kundan keyin tug‘ilgan kuningiz!${extraHTML}`
	} else if (clickCount === 1) {
		const weeks = Math.floor(daysLived / 7)
		result.innerHTML = `Siz taxminan <strong>${weeks}</strong> hafta yashagansiz.<br>
      Yana <strong>${daysLeft}</strong> kundan keyin tug‘ilgan kuningiz!${extraHTML}`
	} else {
		const years = Math.floor(daysLived / 365.25)
		const weeks = Math.floor(daysLived / 7)
		result.innerHTML = `🗓️ Siz yashagansiz:<br>
      <strong>${years}</strong> yil<br>
      <strong>${weeks}</strong> hafta<br>
      <strong>${daysLived}</strong> kun<br><br>
      🎉 Tug‘ilgan kuningizgacha yana <strong>${daysLeft}</strong> kun qoldi!${extraHTML}`
	}

	clickCount = (clickCount + 1) % 3
	showResult()
}

function reset() {
	clickCount = 0
	daysLived = 0
	savedBirthDate = null
	document.getElementById('birthDate').value = ''
	const result = document.getElementById('result')
	result.innerHTML = ''
	result.style.display = 'none'
}
