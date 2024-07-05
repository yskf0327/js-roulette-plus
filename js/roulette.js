document.addEventListener('DOMContentLoaded', () => {
	// エリア取得
	const menuArea = document.getElementById('menu');
	const displayArea = document.getElementById('roulette');
	const optionArea = document.getElementById('option');
	const lengthInputArea = document.getElementById('roulette-length').closest('.c-form__group');

	// ボタン取得
	const addOptionButton = document.getElementById('add-option-button');
	const removeOptionButton = document.getElementById('remove-option-button');
	const createButton = document.getElementById('create');
	const rouletteButton = document.getElementById('roulette-button');

	// ラジオボタン
	const typeRadioArray = document.getElementsByName('type');

	// アルファベットの配列
	const alphabetArray = [...'abcdefghijklmnopqrstuvwxyz'];

	// ルーレットの長さ
	let rouletteLength = 0;

	// interval id
	let id;

	// 乱数
	let r;

	// ルーレットの種類
	let rouletteType = 'alphabet-upper';

	// ルーレットのデータ
	let rouletteData = new Array();

	typeRadioArray.forEach(radio => {
		radio.addEventListener('click', (e) => {
			rouletteType = e.target.value;
			if (rouletteType === 'custom') {
				let optionCnt = 1;
				const inputWrapper = optionArea.children[0];
				optionArea.classList.remove('hide');
				lengthInputArea.classList.add('hide');

				addOptionButton.addEventListener('click', () => {
					optionCnt++;
					inputWrapper.append(createInput('text', optionCnt));
				});
				removeOptionButton.addEventListener('click', () => {
					let inputArray = inputWrapper.children;
					let inputArrayLength = inputArray.length;
					if (inputArrayLength > 1) {
						inputWrapper.removeChild(inputArray[inputArrayLength - 1]);
						optionCnt--;
					}
				});
			} else {
				optionArea.classList.add('hide');
				lengthInputArea.classList.remove('hide');
			}
		});
	});

	createButton.addEventListener('click', () => {
		rouletteData = new Array();
		if (rouletteType !== 'custom') {
			rouletteLength = parseInt(document.getElementById('roulette-length').value);
			switch (rouletteType) {
				case 'alphabet-lower':
					rouletteData = alphabetArray.slice(0, rouletteLength);
					break;
				case 'alphabet-upper':
					rouletteData = alphabetArray.slice(0, rouletteLength).map(value => value.toUpperCase());
					break;
				case 'number':
					rouletteData = [...Array(rouletteLength)].map((_, i) => i + 1);
					break;
			}
		} else {
			const optionDataArray = document.querySelectorAll('input[name^=option]');
			optionDataArray.forEach(data => {
				rouletteData.push(data.value);
			});
			rouletteData = rouletteData.filter(n => n !== '');
			rouletteLength = rouletteData.length;
		}
		if (rouletteLength > 1) {
			menuArea.classList.remove('is-opened');
			setTimeout(() => {
				menuArea.style.display = 'none';
			}, 1000);
			displayArea.innerText = rouletteData[0];
		}
	});

	rouletteButton.addEventListener('click', () => {
		runRoulette(rouletteButton);
		if (rouletteLength < 1) {
			rouletteButton.setAttribute('disabled', 'true');
		}
	});

	function runRoulette(button) {
		if (!id) {
			button.innerText = 'stop';
			id = setInterval(() => {
				r = Math.floor(Math.random() * rouletteLength);
				displayArea.innerText = rouletteData[r];
			}, 20);
		} else {
			clearInterval(id);
			rouletteData.splice(r, 1);
			rouletteLength--;
			id = null;
			button.innerText = 'start';
		}
	}

	function createInput(type, count) {
		const inputElm = document.createElement('input');
		inputElm.setAttribute('type', type);
		inputElm.setAttribute('id', `option${count}`);
		inputElm.setAttribute('name', `option${count}`);
		return inputElm;
	}
});
