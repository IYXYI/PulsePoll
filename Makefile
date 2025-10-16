install:
	@echo "Installing frontend and worker deps..."
	cd frontend && npm install
	cd ../wrangler && npm install
	@echo "Done. See DEV_SETUP.md for next steps."
