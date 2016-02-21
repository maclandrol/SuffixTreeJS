## SuffixTree JS

SuffixTree JS is a javascript implementation of [Ukkonen's algorithm](https://www.cs.helsinki.fi/u/ukkonen/SuffixT1withFigs.pdf) for "generalized suffix tree". The code is essentially based on the snippets provided here : http://www.allisons.org/ll/AlgDS/Tree/Suffix/. 

### Visualization

The main contribution is this website : http://mrnoutahi.com/SuffixTreeJS/ that enable suffix trees visualisation using [d3js](https://d3js.org/). 

####Important points: 

1. Your sequences should be separated by a coma (","). A space is considered as an actual character so don't put spaces between your sequences.
2. The following characters are special chars used to denote the end of a sequence : ```#$&%@?+*```
4. Each internal node can be collapsed.
5. The suffix on each leaf end with ```[start, number]``` where ```start``` is the position of the suffix (starting at 0) and ```number``` is the sequence number of the sequence the suffix is from. I also use different colors for each sequence in the representation. 
3. There is a maximum of 12 sequences allowed (since the color palette used has only 12 colors).


Check the **gh-pages** branch if you're interested in the visualization part. The theme used is [Solo](http://chibicode.github.io/solo). I'm open to any suggestions.


### License

This is licensed under the MIT License
