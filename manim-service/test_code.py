from manim import *

class GeneratedScene(Scene):
    def construct(self):
        text = Text("Hello from AI!", font_size=48)
        self.play(Write(text))
        self.wait(1)
