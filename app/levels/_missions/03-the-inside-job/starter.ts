// Starter Python shown in the editor when the level opens.
const starter = `# keys   -> the 4 digits on the keypad RIGHT NOW (they change every second)
# code   -> the 4 digits you must match
# locked -> which dials are already locked (True / False)
# lock(i) -> locks dial i (0 to 3). Only call it when keys[i] matches code[i]!
#
# Your script runs again every second with a fresh keypad.

if keys[0] == code[0]:
    lock(0)

# TODO: add a check for dial 1
# TODO: add a check for dial 2
# TODO: add a check for dial 3
`;

export default starter;
