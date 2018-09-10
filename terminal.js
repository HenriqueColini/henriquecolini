function Terminal() {

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
	this.printQueue = [];

	this.asyncPrint = async function(str) {
		str = String(str);
		if (str) {

			let regex = /(?<!@)\@\{((([a-z]*|[A-Z]*|[0-9]*|\-))*)\}/gm;
			let values = [];
			let colorMatches = [];

			while ((match = regex.exec(str)) != null) {
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
					for (let c = 0; !cleared && c < values[i].length; c++) {
						await new Promise(resolve => setTimeout(resolve, 5));
						if (this.printQueue.length > 0) {
							this.inside.innerText += values[i].charAt(c);
						}
						else {
							cleared = true;
						}
					}
				}
				else {
					if (!isNaN(values[i].color)) {
						this.asyncSetColor(this.colorList[Number(values[i].color)]);
					}
					else {
						this.asyncSetColor(values[i].color);
					}
				}
			}

		}

		this.printQueue.shift();

		if (this.printQueue.length > 0) {
			this.asyncPrint(this.printQueue[0]);
		}

	}

	this.print = function(str) {
		this.printQueue.push(str);
		if (this.printQueue.length == 1) {
			this.asyncPrint(str);
		}
	}

	this.println = function(str) {
		this.print(str+'\n');
	}

	this.asyncSetColor = function(color){

		let sanatized = color.trim().toLowerCase().replace("_","-");

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
		this.print('@{'+color+'}');
	}

	this.clear = function(){
		this.printQueue = [];
		while(this.term.lastChild){
			this.term.removeChild(this.term.lastChild);
		}
		this.createCaret();
		this.setColor("light-gray");
	}

	this.createCaret = function() {
		this.caret = document.createElement("SPAN");
		this.caret.id = "caret";
		this.caret.textContent = '█';
		this.term.appendChild(this.caret);
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

t.setColor("light-yellow");
t.println("╔═════════════════════╗");
t.println("║ @{light-cyan}☺ Henrique Colini ☺ @{light-yellow}║")
t.setColor("light-yellow");
t.println("╚═════════════════════╝\n");

t.print("@{light-green}Welcome to my home page!\n\n");
t.setColor("light-gray");
t.println("You can print in this terminal!\n");
t.println("1. Open the developer console");
t.println('2. t.print(message) will print a message');
t.println('3. t.println(message) will print a message and include a \\n');
t.println('4. t.setColor() will change the current color');
t.println('5. Additionally, you can include @@{color-codes} on your prints\n');

for (let i = 0; i < t.colorList.length; i++) {
	t.println('@{'+t.colorList[i]+'}' + i + ' - '+t.colorList[i]);
}
