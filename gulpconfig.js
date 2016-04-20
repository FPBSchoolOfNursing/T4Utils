module.exports = {
    t4version: '8.1.5', //you'll have to config this for your environment
    components: ['./components/javadependencies.js',
                './components/base.js',
				'./components/sitemanager.js',
				'./components/brokerUtils.js',
				'./components/elementInfo.js',
				'./components/getSectionInfo.js',
				'./components/media.js',
				'./components/security.js'				
    ],
    outputDir: './T4Utils/',
    isProduction: (process.env.NODE_ENV === 'production'), //Set from command line like SET NODE_ENV=production.
    banner: ['/**',
            ' * <%= package.name %> - <%= package.description %>',
            ' * @version v<%= package.version %>',
            ' * @link <%= package.repository.url %>',
            ' * @author <%= package.author %>',
            ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.',
            ' * Built: ' + new Date() + '.',
            ' */',
            ''
    ].join('\n')
};
