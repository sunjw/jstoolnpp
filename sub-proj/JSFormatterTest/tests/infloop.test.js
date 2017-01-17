writeOut = function (start) {
	var self = start;
	do {
		console.log(self.parentWidget);
		self = self.parentWidget;
	}
until(!self.parentWidget)
};
