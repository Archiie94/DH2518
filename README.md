# DH2518
Project of a course at KTH: DH2518

# Development
- Clone project
- Make sure your terminal is in the qr folder: `cd qr`
- Run `npm install` to install the dependencies
- Run the app with `monaca preview` (if this fails, see monaca setup)
- Launch your browser and open http://localhost:8000.

# Monaca Setup
- `npm install -g monaca`
- If `monaca preview` does not work at this point, run `monaca create hello` and select onsen with react, and then react navigation. When it is done remove the folder called "hello" which was created. (e.x. `rm -rf hello`)
- `monaca preview` should work now

# Other useful things
- All the code is in the qr/src folder. These should be the only files you need to edit.
- The visual components are each in their own folder. These folders contain an index.js and index.css file. Try to keep the css specific to the component you are working on. The src/style.css file should be used for more global css.
