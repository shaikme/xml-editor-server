'use strict';

module.exports = {
	traverse: (document, id) => {
		let queue = [document];

		while (queue.length > 0){
			const tempNode = queue.shift();

			if (tempNode.id === id) return tempNode;

			if (tempNode.elements) queue = queue.concat(tempNode.elements);
		}

		return null;
	}
}