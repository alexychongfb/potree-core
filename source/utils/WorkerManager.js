"use strict";

import {Global} from "../Potree.js";

/**
 * The worker manager is responsible for creating and managing worker instances.
 */
class WorkerManager
{
	constructor()
	{
		this.workers = [];

		for(var i = 0; i < 5; i++)
		{
			this.workers.push([]);
		}
	}

	/**
	 * Get a worker from the pool, if none available one will be created.
	 */
	getWorker(type)
	{
		if(this.workers[type].length > 0)
		{
			return this.workers[type].pop();
		}
		
		return new Worker(Global.workerPath + WorkerManager.URLS[type]);
	}

	/**
	 * Return (reinsert) the worker into the pool.
	 */
	returnWorker(type, worker)
	{
		this.workers[type].push(worker);
	}

	/**
	 * Run a task immediatly.
	 */
	runTask(type, onMessage, message, transfer)
	{
		var self = this;

		var worker = this.getWorker(type);
		worker.onmessage = function(event)
		{
			onMessage(event);
			self.returnWorker(type, worker);
		};

		if(transfer !== undefined)
		{
			worker.postMessage(message, transfer);
		}
		else
		{
			worker.postMessage(message);
		}
	}
};

WorkerManager.BINARY_DECODER = 0;
WorkerManager.LAS_LAZ = 1;
WorkerManager.LAS_DECODER = 2;
WorkerManager.GREYHOUND = 3;
WorkerManager.DEM = 4;

WorkerManager.URLS = 
[
	"/workers/BinaryDecoderWorker.js",
	"/workers/LASLAZWorker.js",
	"/workers/LASDecoderWorker.js",
	"/workers/GreyhoundBinaryDecoderWorker.js",
	"/workers/DEMWorker.js"
];

export {WorkerManager};
