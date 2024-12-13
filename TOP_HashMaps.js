class LinkedList {
	constructor(){
		this.head = null;
		this.tail = null;
		this.size = 0;
	}

	append(key, value) {
		const newNode = new Node(key, value);
		
		if(!this.head) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			this.tail.next = newNode;
			this.tail = newNode;
		}
		this.size++;
		return this;
	}

	prepend(key, value) {
		const newNode = new Node(key, value);

		if(!this.head){
			this.head = newNode;
			this.tail = newNode;
		} else {
			newNode.next = this.head;
			this.head = newNode;
		}

		this.size++;
		return this
	}

	at(index) {
		if(!this.head || index < 0 || index > this.size-1) return undefined;

		let current = this.head;
		let number = 0;
			while(number < index){
				current = current.next;
				number++;
			}
		return current
	}

	pop(){
		let newTail = this.at(this.size-2);
		let popped = newTail.next;
		this.tail = newTail;
		newTail.next = null;
		
		this.size--;
		return popped;
	}

	contains(key){
		let current = this.head;
		while(current){
			if(current.key === key){
				return true;
			} else current = current.next;
		}
		return false
	}

	find(key){
		let count = 0;
		let current = this.head;
		while(current){
			if(current.key === key){
				return count
			} else {
				count++;
				current = current.next;
			}
		}
		return null;
	}

	toString(){
		let result = '';
		let current = this.head;
		while(current){
			result += `( ${current.value} ) -> `;
			current = current.next;
		}
		result += 'null';
		return result;
	}
	
	insertAt(index, key, value){
		if(index < 0 || index > this.size-1) return false;
		if(index === 0) {
			this.prepend(key, value);
			return true;
		}
		if(index === this.size-1){
			this.append(key, value);
			return true;
		}

		let newNode = new Node(key, value),
				number = 0,
				preTarget = this.at(index-1);
		
		newNode.next = preTarget.next;
		preTarget.next = newNode;

		this.size++;
		return true;
	}

	removeAt(index){
		if(index < 0 || index > this.size -1) return false

		let preTarget = this.at(index-1);
		let removed = preTarget.next;
		preTarget.next = removed.next;

		this.size--;
		return removed;
	}
}

class Node{
	constructor(key, value){
		this.key = key;
		this.value = value;
		this.next = null;
	}
}


class HashMap {
	constructor(){
		this.buckets = new Array(16);
		this.capacity = this.buckets.length;
		this.loadFactor = 0.8;
	}

	hash(key){
		let hashCode = 0;

		const primeNumber = 11;
		for(let i = 0; i < key.length; i++){
			hashCode = primeNumber * hashCode + key.charCodeAt(i)
		}

		return hashCode % this.buckets.length
	}

	set(key, value, recycleOldKey = false) {
		let hash = this.hash(key);
		let newEntry = new Node(key,value);
		let oldNode;

		if(!this.buckets[hash]){
			this.buckets[hash] = new LinkedList();
			this.buckets[hash].append(key, value);
		} else {
			if(this.buckets[hash].head.key === key){
				if(this.buckets[hash].size === 1){
					this.buckets[hash].head = newEntry;
					this.buckets[hash].tail = newEntry;
				} else {
					if(recycleOldKey) {
						oldNode = this.buckets[hash].head;
					}
					newEntry.next = this.buckets[hash].head.next;
					this.buckets[hash].head = newEntry;
				}
			}
			else {
				//IF newEntry has same key to existing key, find and replace existing key
				if(this.buckets[hash].contains(key)){
					if(recycleOldKey){
						oldNode = this.buckets[hash].at(this.buckets[hash].find(key));
					}
					let current = this.buckets[hash].head;
					let idx = 0;
					while(current){
						if(current.key === key){
							this.buckets[hash].at(idx-1).next = newEntry;
							newEntry.next = this.buckets[hash].at(idx+1);
							if(idx === this.buckets[hash].size-1){
								this.buckets[hash].tail = newEntry;
							}
							break;
						} else {
							current = current.next;
							idx++;
						}
					}
				} else {
					this.buckets[hash].append(key,value);
				}
			}
		}

		let currentCapacity = this.length();
		if( (this.capacity*this.loadFactor) <  currentCapacity){
			this.buckets.length *= 2
		}
		if(this.buckets[hash].contains(key) && recycleOldKey){
			return oldNode
		} else {
			return true
		}
	}

	get(key) {		
		let hash = this.hash(key);
		
		if(!this.buckets[hash]) return null;

		let current = this.buckets[hash].head;
		while(current){
			if(current.key === key){
				return current.value
			} else {
				current = current.next
			}
		}

		return null
	}

	has(key) {
		let hash = this.hash(key);

		if(!this.buckets[hash]) return false;

		let current = this.buckets[hash].head;
		while(current){
			if(current.key === key){
				return true
			} else {
				current = current.next;
			}
		}
		return false;
	}

	remove(key){
		let hash = this.hash(key);
		if(!this.buckets[hash]) return false
		
		let current = this.buckets[hash];
		if(current.head.key === key) {
			if(!current.head.next) {
				delete this.buckets[hash];
				return true;
			} else {
				this.buckets[hash].head = current.head.next;
				return true
			}
		} 
		else {
		current = this.buckets[hash].head;

		while(current){
			if(current.next.key === key){
				if(!current.next.next){
                    current.next = null;
                    this.buckets[hash].tail = null;
                    this.buckets[hash].size--;
					return true;
				} else {
                    current.next = current.next.next;
                    this.buckets[hash].size--;
					return true;
				}
			} else {
				current = current.next;
			}
		}
		return false
		}
	}

	length(){
		let number = 0;
		for(let item of this.buckets){
			if(item) {
				let current = item.head;
				while(current){
					number++;
					current = current.next
				}
			}
		}
		return number
	}

	clear(){
		this.buckets = new Array(16);
		return true;
	}

	keys(){
		let list = [];
		for(let item of this.buckets){
			if(!item) continue;
			else {
				let current = item.head;
				while(current){
					list.push(current.key);
					current = current.next;
				}
			}
		}
		return list
	}

	values(){
		let list = [];
		for(let item of this.buckets){
			if(!item) continue;
			else {
				let current = item.head;
				while(current){
					list.push(current.value);
					current = current.next;
				}
			}
		}
		return list
	}

	entries(){
		let list = [];
		for(let item of this.buckets){
			if(!item) continue;
			else {
				let current = item.head;
				while(current){
					list.push([current.key, current.value]);
					current = current.next;
				}
			}
		}
		return list
	}
}
