"use strict";

class Store {
    constructor(volumes = {}){
        this._initialized = { status: false };
        this._ns = ["_reflects", "_rangedNumbers", "_lockeds", "_", "_initialized"];
        this._preinitialize();
        return this.initialize(volumes);
    }

    initialize(volumes) {
        if(this._initialized.status === true || !Object.values(volumes).length) return this;
        for(let [key, value] of Object.entries(volumes)) this.addVolume(key, value);
        this._initialized.status = true;
        this._initialized = Object.freeze(this._initialized);
        return this;
    }

    is(...args){
        return this._isMarriage(args);
    }

    isnt(...args){
        return !this._isMarriage(args);
    }

    addVolume(key, value){
        const volume = this._filterData({[key]: value});
        let valueType = this._typeOf(volume[key]);
        if(valueType === "number" || valueType === "string" || valueType === "boolean" ){
            this._[key] = {
                value: volume[key],
                type: valueType
            };
            this._accessorify({ key, valueType });
        }
    }

    addReflect(key, fn, jerk = false){
        if(key in this && this._isFn(fn)) {
            this._reflects[key] = fn;
            if(typeof jerk === "boolean" && jerk === true){
                this._reflect(key, this._[key].value);
            }
        }
        return this;
    }

    removeReflect(key){
        delete this._reflects[key];
        return this;
    }

    addRange(key, range, minReflect, maxReflect){
        if(this._typeOf(this[key]) !== "number"
            || !Array.isArray(range)
            || range.length !== 2
            || !range.every(item => this._isNum(item))) return;

        if(range[1] < range[0]) {
            range.reverse();
        }

        this._rangedNumbers[key] = { range: range };
        let rangeObject = this._rangedNumbers[key];
        if(this._isFn(minReflect)) {
            rangeObject.minReflect = minReflect;
        }
        if(this._isFn(maxReflect)) {
            rangeObject.maxReflect = maxReflect;
        }

        this._rangedNumbers[key] = Object.freeze(rangeObject);

        this[key] = this._holdInRange(key, this[key]);

        return this;
    }

    removeRange(key){
        delete this._rangedNumbers[key];
        return this;
    }

    isRanged(key = ""){
        return this._isFeatured('_rangedNumbers', key);
    }

    addLock(key){
        if(!key in this && !key in this._lockeds) return;
        this._lockeds[key] = true;
        return this;
    };

    removeLock(key){
        delete this._lockeds[key];
        return this;
    }

    isLocked(key = ""){
        return this._isFeatured('_lockeds', key);
    }

    exportData(...exportKeys) {
        let response = {};
        for(let [key, data] of Object.entries(this._)){
            response[key] = data.value;
        }
        if(exportKeys.length){
            for(let key of Object.keys(response)){
                if(!exportKeys.includes(key)){
                    delete response[key];
                }
            }
        }

        return response;
    }

    _reflect(key, value) {
        let { _reflects } = this;
        if(key in _reflects && this._isFn(_reflects[key])) {
            _reflects[key](value);
        }
    }

    _typeOf (object) {
        return Object.prototype.toString
            .call(object)
            .replace(/^\[object (.+)\]$/, '$1')
            .toLowerCase();
    }

    _holdInRange(key, value){
        let rangeObject = this._rangedNumbers[key],
            [min, max] = rangeObject.range,
            {minReflect, maxReflect} = rangeObject;
        if(value < min) {
            this._isFn(minReflect) && minReflect(min);
            return min;
        }
        if(value > max){
            this._isFn(maxReflect) && maxReflect(max);
            return max;
        }
        return value;
    }

    _isFn(fn) {
        return this._typeOf(fn) === "function";
    };

    _isNum(num) {
        return this._typeOf(num) === "number" && !isNaN(num);
    }

    _isMarriage(array) {
        for(let key of array){
            if(!Boolean(this[key])) return false;
        }
        return true;
    }

    _isFeatured(groupName, key) {
        if(!groupName in this) {
            return false;
        }
        for(let item of Object.keys(this[groupName])){
            if(item === key) return true;
        }
        return false;
    }

    _preinitialize() {
        for(let key of this._ns){
            this[key] = {};
        }
        return this;
    }

    _filterData(object = {}) {
        for(let key of this._ns){
            if(object[key]) delete object[key];
        }
        return object;
    }

    _accessorify(options = {}) {
        let {key, valueType} = options;
        const self = this;
        Object.defineProperties(this, {
            [key]: {
                get(){
                    return self._[key].value;
                },
                set(value){
                    let dataItem = self._[key];
                    if(self._typeOf(value) === dataItem.type
                        && !self.isLocked(key) && !/object|array/.test(valueType)){
                        if(self._isNum(value) && self.isRanged(key)){
                            value = self._holdInRange(key, value);
                        }
                        if(value !== dataItem.value){
                            dataItem.value = value;
                            self._reflect(key, value);
                            return true;
                        }
                    }
                }
            }
        });
    }

}

