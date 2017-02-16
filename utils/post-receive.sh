#!/bin/bash                                                        
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"            
target_branch="master"                                             
working_tree="/home/pi/nwpos"                                      
                                                                   
while read oldrev newrev refname                                   
do                                                                 
    branch=$(git rev-parse --symbolic --abbrev-ref $refname)       
    GIT_WORK_TREE=$working_tree git checkout $target_branch -f     
    NOW=$(date +"%Y%m%d-%H%M")                                     
    git tag release_$NOW $target_branch                            
    echo " /==============================="                       
    echo " | DEPLOYMENT COMPLETED"                                 
    echo " | Target branch: $target_branch"                        
    echo " | Target folder: $working_tree"                         
    echo " | Tag name     : release_$NOW"                          
    echo " \=== Installing missing deps ==="                       
    sudo "$DIR/post-install"                                       
done                                                               