let t = new Terminal();
t.printStep = 100;

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
t.println("Alternatively, you can insert a setColor() in your printed string, by adding a");
t.println("@{15}@@{color} @{2}to the text. Adding an extra @{15}@ @{3}will escape the color code.\n");

t.println("For example, this:\n");
t.println('@{1}t.print(@{2}"Lorem @@{light-red}ipsum dolor sit @@{light-gray}amet, consectetur @@{6}adipisicing @@@{cyan}elit, sed do eiusmod tempor."@{1});\n');

t.setColor("light-gray");
t.println("Will print as:\n");
t.println("Lorem @{light-red}ipsum dolor sit @{light-gray}amet, consectetur @{6}adipisicing @@{cyan}elit, sed do eiusmod tempor.\n");

t.setColor("light-green");
t.println("Delay");
t.println("------------------------------\n");

t.setColor("light-gray");
t.println("As you might have noticed, the terminal takes a while to print everything. This is by design.");
t.println("In fact, the speed in which the text is printed is controlled by two variables:\n");

t.println("@{3}t.printDelay@{1} > Delay between each step, in ms. Minimum of 5. If set to 0, printing will be instant.");
t.println("@{3}t.printStep@{1} > How many characters are printed each step. Minimum of 1.\n");

t.setColor("light-green");
t.println("Queue and Async functions");
t.println("------------------------------\n");

t.setColor("light-gray");
t.println("Because of the delay, the print(), setColor() and clear() functions are added to an execution queue");
t.println("every time you call one of them. If you want to ignore the queue, you may use the async functions");
t.println("(described in 'Usage'), which will run instantly, regardless of the queue. These should generally not");
t.println("be used, as they might cause unexpected behavior, such as two prints merging together or a clear() not");
t.println("stopping a print in progress. To clear all the text and the queue, use the reset() function.\n");

t.setColor("light-green");
t.println("Boxes");
t.println("------------------------------\n");
