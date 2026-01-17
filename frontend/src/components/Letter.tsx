import React from 'react';

export const Letter: React.FC = () => {
  return (
    <section className="px-4 sm:px-0 pb-4 sm:pb-0">
      <div className="">
        <h2 className="text-center text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground mb-8">
          How do I say 'I love you' when I’m no longer there to say it?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8 text-lg text-primary-foreground">
          <div className="flex flex-col gap-4">
            <p>
              I imagined a man in his sunset years, looking at the woman who walked beside him for decades. He wanted to ensure that on every anniversary after he was gone, she would <span className="font-bold">still hear his voice</span> through the language of flowers.
            </p>
            <p>
              It felt radical, perhaps even impossible. But it was too beautiful to ignore. 
            </p>
            <p>
              We built this to turn a temporary bloom into a permanent bridge—allowing love to <span className="font-bold">defy the calendar</span> and keep a promise that even time cannot break.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <p>
              We soon realized that you don't have to be dying for it to be a great gift. ForeverFlower is just as much for the son who wants to ensure his mother feels <span className="font-bold">cherished every May</span>, or the partner who wants to guarantee a decade of birthdays are celebrated with style.
            </p>
            <p>
              It's for the person who wants to be known as <span className="font-bold">the one who always remembers</span>—the one whose love isn't just felt today, but is promised for every year to come.
            </p>
            <div>
              <p>Ethan Betts.</p>
              <p className="italic text-sm">Founder and Developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
