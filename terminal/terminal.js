function Terminal(printDelay=5,printStep=5) {

	this.term = document.getElementById("terminal");
	this.inside = this.term;
	this.caret = null;
	this.colorList = ["black",
					"dark-gray",
					"light-gray",
					"white",
					"red",
					"green",
					"yellow",
					"blue",
					"magenta",
					"cyan",
					"light-red",
					"light-green",
					"light-yellow",
					"light-blue",
					"light-magenta",
					"light-cyan"];
	this.commandQueue = [];
	this.printDelay = printDelay>=0?printDelay:0;
	this.printStep = printStep>=1?printStep:1;
	this.boxStyles = [];

	this.boxStyles['template'] = ['0','1','2','3','4','5','6','7'];
	this.boxStyles['line'] = ['┌','┐','├','┤','└','┘','─','│'];
	this.boxStyles['double_line'] = ['╔','╗','╠','╣','╚','╝','═','║'];
	this.boxStyles['thick_line'] = ['█','█','█','█','▀','▀','▀','█'];
	this.boxStyles['dotted'] = ['.','.',':',':',':',':','.',':'];
	this.boxStyles['dashed'] = ['┌','┐',':',':','└','┘','-','|'];

	this.runQueue = async function(cmd) {

		if (cmd) {

			if (cmd.type === 'print') {
				str = cmd.str;
				if (str) {

					//(?:[^\@]|^)(\@\{[\d\b\-]+\})

					let regex = /(?:[^@]|^)(@\{[a-zA-Z0-9\-]*\})/gm;
					let values = [];
					let colorMatches = [];

					while ((match = regex.exec(str)) != null) {
						if (match[0].charAt(0) != '@') {
							match.index++;
							match[0] = match[0].substr(1);
						}
						colorMatches.push(match);
					}

					for (let i = 0; i < str.length; i++) {
						for (let j = 0; j < colorMatches.length; j++) {
							if(colorMatches[j].index == i){
								i+= colorMatches[j][0].length;

								let obj = {color:colorMatches[j][0].replace('@{','').replace('}','')};

								values.push(obj);
							}
						}
						let c = str.charAt(i);
						if (values.length > 0 && typeof values[values.length-1] === 'string') {
							values[values.length-1] += c;
						}
						else {
							if (c !== '') {
								values.push(c);
							}
						}
					}

					let cleared = false;

					for (let i = 0; !cleared && i < values.length; i++) {
						if (typeof values[i] === 'string') {
							values[i] = values[i].replace('@@{','@{');
							for (let j = 0; !cleared && j < values[i].length; j++) {
								if (this.printDelay > 0 && j%this.printStep==0) {
									await new Promise(resolve => setTimeout(resolve, this.printDelay));
								}
								if (this.commandQueue.length > 0) {
									this.inside.innerText += values[i].charAt(j);
								}
								else {
									cleared = true;
								}
							}
						}
						else {
							this.asyncSetColor(values[i].color);
						}
					}

				}

				window.scrollTo(0,document.body.scrollHeight);
			}

			else if (cmd.type === 'color') {
				this.asyncSetColor(cmd.color);
			}

			else if (cmd.type === 'clear') {
				this.asyncClear();
			}

			this.commandQueue.shift();

			if (this.commandQueue.length > 0) {
				this.runQueue(this.commandQueue[0]);
			}

		}

	}

	this.addToQueue = function(cmd){
		this.commandQueue.push(cmd);
		if (this.commandQueue.length == 1) {
			this.runQueue(cmd);
		}
	}

	this.print = function(str) {
		this.addToQueue({type:'print',str:str});
	}

	this.println = function(str) {
		if (str)
			this.print(str+'\n');
		else
			this.print('\n');
	}

	this.asyncSetColor = function(color){

		let sanatized;

		if (!isNaN(color)) {
			sanatized = this.colorList[Number(color)];
		}
		else {
			sanatized = color.trim().toLowerCase().replace("_","-");
		}

		if(this.colorList.indexOf(sanatized) != -1) {

			if (this.inside !== this.term && this.inside.textContent === "") {
				this.inside.className = sanatized;
			}
			else {
				let span = document.createElement("SPAN");
				span.classList.add(sanatized);

				this.term.insertBefore(span,this.caret);
				this.inside = span;
			}

		}

	}

	this.setColor = function(color){
		this.addToQueue({type:'color',color:color});
	}

	this.asyncClear = function(){
		while(this.term.lastChild){
			this.term.removeChild(this.term.lastChild);
		}
		this.createCaret();
		this.setColor("light-gray");
	}

	this.reset = function(){
		this.commandQueue = [];
		this.asyncClear();
	}

	this.clear = function(){
		this.addToQueue({type:'clear'});
	}

	this.createCaret = function() {
		this.caret = document.createElement("SPAN");
		this.caret.id = "caret";
		this.caret.textContent = '█';
		this.term.appendChild(this.caret);
	}

	this.printBox = function(strings,boxColor,boxStyle,lineBefore=true,lineAfter=true){
		if (strings) {

			if (typeof strings === 'string') {
				strings = [strings];
			}

			if (typeof boxStyle === 'string') {
				boxStyle = this.boxStyles[boxStyle];
			}

			let str = '';
			let biggest = 0;

			for (let i = 0; i < strings.length; i++) {
				let string = strings[i];
				for (let j = 0; j < this.colorList.length; j++){
					string = string.replace(`@{${this.colorList[j]}}`,'');
				}
				let len = string.length;
				biggest = len > biggest ? len : biggest;
			}

			str+=lineBefore?'\n':'';

			str+='@{'+boxColor+'}';

			str+=boxStyle[0];

			for (let i = 0; i < biggest; i++) {
				str+=boxStyle[6];
			}

			str+=boxStyle[1]+'\n';

			for (let i = 0; i < strings.length; i++) {
				str+=boxStyle[7];

				for (var j = 0; j < Math.ceil((biggest-strings[i].length)/2); j++) {
					str+=' ';
				}

				str+='@{light-gray}'+strings[i];

				for (var j = 0; j < Math.floor((biggest-strings[i].length)/2); j++) {
					str+=' ';
				}

				str+='@{'+boxColor+'}'+boxStyle[7]+'\n';
				if (i!=strings.length-1) {
					str+=boxStyle[2];
					for (let i = 0; i < biggest; i++) {
						str+=boxStyle[6];
					}
					str+=boxStyle[3]+'\n';
				}
			}

			str+=boxStyle[4];

			for (let i = 0; i < biggest; i++) {
				str+=boxStyle[6];
			}

			str+=boxStyle[5];

			str+=lineAfter?'\n':'';

			console.log(str);
			this.print(str);

		}
	}

	this.setColor("light-gray");
	this.createCaret();
	this.caretState = false;
	setInterval(function(){
		this.caretState = !this.caretState;
		this.caret.textContent = this.caretState ? ' ' : '█';
	},500);

}

let t = new Terminal();

t.printBox("terminal.js","light-blue","double_line",false)
t.println();

t.setColor("light-green");
t.println("About");
t.println("------------------------------\n")

t.setColor("light-gray");
t.println("terminal.js is a Windows CMD-like terminal made in JavaScript.\n");
t.println("It doesn't actually do anything. You can't enter any commands - you may only print stuff to it.");
t.println("Nonetheless, that's already pretty cool.\n")

t.setColor("light-green");
t.println("Usage");
t.println("------------------------------\n")

t.setColor("light-gray");
t.println("So far, you can only print stuff via the developer console (F12 or CTRL+Shift+i).");
t.println("You can also change the color of the text. The following functions are available:\n");

t.println("@{3}t.print(content)@{1} > This will print content to the terminal.");
t.println("@{3}t.println(content)@{1} > This will print content to the terminal with a '\\n' included.");
t.println("@{3}t.setColor(color)@{1} > This change the color of the following text.");
t.println("@{3}t.clear()@{1} > This will clear the terminal.");
t.println("@{3}t.reset()@{1} > Similar to t.clear(), this will also clear the queue (more information below).");
t.println("@{3}t.printBox(content,bc,bs,lb,la)@{1} > This will print a box (more information below).\n");

t.setColor("light-gray");
t.println("Those async functions are also available (more information below):\n");

t.println("@{3}t.asyncPrint(content)@{1} > Asynchronized print().");
t.println("@{3}t.asyncSetColor(color)@{1} > Asynchronized setColor().");
t.println("@{3}t.asyncClear()@{1} > Asynchronized clear().\n");

t.setColor("light-green");
t.println("Colors");
t.println("------------------------------\n")

t.setColor("light-gray");
t.println("In order to change the color of the text, call the function t.setColor(color).");
t.println("'color' can be a number or the name of the color. The following colors are available:\n");

for (let i = 0; i < t.colorList.length; i++) {
	t.print("@{light-gray}"+ i +" > ");
	t.println('@{'+i+'}'+t.colorList[i]);
}

t.setColor("light-gray");
t.println("\nCalling setColor() will change the color of every text that follows it.");
t.println("Alternatively, you can insert a setColor() in your printed string, by adding a\n");
t.println("@{15}@@{color}");
