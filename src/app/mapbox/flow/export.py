from pathlib import Path

prefix = "glsl_flow_"

files = []
for p in sorted(Path("./shaders").glob("*")):
    files.append((
        prefix + p.name.split(".")[0],
        p.read_text().strip().replace("\n", "\\n")
    ))

lines = []
for n, content in files:
    lines.append(f"const {n} = `{content}`")
lines.append("")
lines.append(f"export {{{', '.join([n for n, _ in files])}}}")

with open(Path("FlowShaders.ts"), "w") as f:
    f.write("\n".join(lines))
