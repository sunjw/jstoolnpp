var fileTypes = ["*.arj", "*.dbf"];
var onePackInFile = [true, true];
var functionNames = ["oshchadKvyt", "oshchadKvytNew"];

var = "!!! Last_character_coses_a_leak_я";

var oshchadKvyt = function (filePath) {
	if (!form.copyFile(filePath, form.binDirPath() + "/" + kvytDir + "/" + form.fileName(filePath))) {
		form.showMessage("Помилка копіювання", "Програма не змогла cкопіювати файл " + filePath + "");
		return;
	}
	form.setCurrentDir(form.binDirPath() + "/" + kvytDir);
	form.execProcess("..\\arj -y e " + form.fileName(filePath) + " *.dbf");
	form.execProcess("..\\7z e -tARJ " + form.fileName(filePath) + " *.dbf -y");
	if (!form.openDbfConnection(form.binDirPath() + "/" + kvytDir + "/" + form.pureFileName(filePath) + ".dbf")) {
		form.showMessage("!!! Помилка під'єднання !!!", "Програма не змогла під'єднатись до зовнішньої бази даних.");
		form.closeDbfConnection();
		return;
	}
	numRows = form.queryNumRows();
	form.setTableRowCount(numRows);
	row = 0;
	while (form.queryNext()) {
		if (row + 1 > numRows)
			form.setTableRowCount(row + 1);
		rahStr = form.queryValue("NRA") - 1000000;
		dateStr = form.queryDateValue("DATAO");
		sumStr = form.queryValue("SUMA");
		kasaStr = form.queryValue("NKA");
		fontColor = clBlack;
		if (rahStr < 1 || sumStr < 0.01)
			fontColor = clRed;
		form.populateTable(row, 1, rahStr, fontColor);
		form.populateTable(row, 2, dateStr, fontColor);
		form.populateTable(row, 3, sumStr, fontColor);
		form.populateTable(row, 4, kasaStr, fontColor);
		form.populateTable(row, 5, "", fontColor);
		row++;
	}
	if (row != numRows)
		form.setTableRowCount(row);
	form.closeDbfConnection();
	form.showMessage("!!! Завершено втягування !!!", "Програма завершила втягування зовнішньої бази даних квитанцій.");
}
var oshchadKvytNew = function (filePath) {
	if (!form.copyFile(filePath, form.binDirPath() + "/" + kvytDir + "/" + form.fileName(filePath))) {
		form.showMessage("!!! Помилка копіювання !!!", "Програма не змогла cкопіювати файл '" + filePath + "'");
		return;
	}
	form.setCurrentDir(form.binDirPath() + "/" + kvytDir);
	form.execProcess("..\\arj -y e " + form.fileName(filePath) + " *.dbf");
	if (!form.openDbfConnection(form.binDirPath() + "/" + kvytDir + "/" + form.pureFileName(filePath) + ".dbf")) {
		form.showMessage("!!! Помилка під'єднання !!!", "Програма не змогла під'єднатись до зовнішньої бази даних.");
		form.closeDbfConnection();
		return;
	}
	numRows = form.queryNumRows();
	form.setTableRowCount(numRows);
	row = 0;
	while (form.queryNext()) {
		if (row + 1 > numRows)
			form.setTableRowCount(row + 1);
		rahStr = form.queryValue("NRA") - 1000000;
		dateStr = form.queryDateValue("DATAO");
		sumStr = form.queryValue("SUMA");
		kasaStr = form.queryValue("NKA");
		fontColor = clBlack;
		if (rahStr < 1 || sumStr < 0.01)
			fontColor = clRed;
		form.populateTable(row, 1, rahStr, fontColor);
		form.populateTable(row, 2, dateStr, fontColor);
		form.populateTable(row, 3, sumStr, fontColor);
		form.populateTable(row, 4, kasaStr, fontColor);
		form.populateTable(row, 5, "", fontColor);
		row++;
	}
	if (row != numRows)
		form.setTableRowCount(row);
	form.closeDbfConnection();
	form.showMessage("!!! Завершено втягування !!!", "Програма завершила втягування зовнішньої бази даних квитанцій.");
}
